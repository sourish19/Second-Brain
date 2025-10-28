import mongoose from 'mongoose';

import logger from '../config/logger.config';
import User from '../schemas/auth.schema';
import Content from '../schemas/content.schema';
import Links from '../schemas/links.schema';
import Share from '../schemas/share.schema';
import Tags from '../schemas/tags.schema';
import { IUser } from '../schemas/auth.schema';
import { ILinks } from '../schemas/links.schema';
import { ITags } from '../schemas/tags.schema';

import {
  NotFoundError,
  ConflictError,
  InternalServerError,
  UnauthorizedError,
  ValidationError,
} from '../utils/apiError.util';
import ApiResponse from '../utils/apiResponse.util';
import asyncHandler from '../utils/asyncHandler.util';
import getPreview from '../utils/preview.util';
import { generateHash, generateShareableLink } from '../utils/helper.util';
import { NO_IMAGE } from '../utils/constants.util';
import {
  setValueToCache,
  getValueFromCache,
  deleteValueFromCache,
} from '../utils/cache.util';

// This is only for sending data to the frontend
export interface IPreviewLink {
  id: string;
  title: string;
  type: string;
  link: string;
  tags: string[];
  image: string | null;
}

type TBody = {
  title?: string;
  link: string;
  type: string;
  tags?: string[];
};

type TExecuteSession = (
  title: string | null,
  type: string,
  tagIds: string[],
  link: string,
  hashedLink: string,
  user: IUser,
  session: mongoose.ClientSession,
  retryCount: number
) => Promise<IPreviewLink>;

type ITagsArray = {
  _id: mongoose.Types.ObjectId;
  tagTitle: string;
};

type TLeanContent = {
  _id: mongoose.Types.ObjectId;
  title: string;
  type: string;
  image?: string;
  tags: ITagsArray[];
  link: { originalLink: string };
};

// Transction login
const executeTransactions: TExecuteSession = async (
  title,
  type,
  tagIds,
  link,
  hashedLink,
  user,
  session,
  retryCount = 3
) => {
  while (retryCount > 0) {
    try {
      await session.startTransaction();

      // Create link & save it in db with session
      const linkDoc = new Links({
        userId: user._id,
        originalLink: link,
        hashedLink,
      });
      await linkDoc.save({ session });

      const previewData = await getPreview(link);

      // check if tagsId are not empty
      let tagsDoc: ITags[] = [];
      if (tagIds.length > 0) {
        logger.debug({ tagIds }, 'Processing content tags');

        tagsDoc = await Tags.find({
          _id: { $in: tagIds },
        }).lean();

        logger.debug({ tagsDoc }, 'Retrieved tag documents');
      }

      // Create content & save it in db with session
      const newContent = new Content({
        userId: user._id,
        title: title || previewData?.title || 'Title',
        image: previewData?.image || NO_IMAGE,
        type,
        link: linkDoc._id,
        tags: tagsDoc?.map((tag) => tag._id),
      });
      await newContent.save({ session });

      await session.commitTransaction();

      return {
        id: String(newContent._id),
        title: newContent.title,
        type: newContent.type,
        link: linkDoc.originalLink,
        image: newContent.image || NO_IMAGE,
        tags: tagsDoc?.map((tag) => tag.tagTitle),
      };
    } catch (error: unknown) {
      await session.abortTransaction();

      logger.error({ err: error }, 'Transaction failed while creating content');

      // Check if error has hasErrorLabel method -- just to check if error is TransientTransactionError or not
      if (
        error &&
        typeof error === 'object' &&
        'hasErrorLabel' in error &&
        typeof (error as any).hasErrorLabel === 'function' &&
        (error as any).hasErrorLabel('TransientTransactionError')
      ) {
        // Retry the transaction
        retryCount--;
        continue;
      }

      if (error instanceof mongoose.Error.ValidationError) {
        throw new ValidationError('Mongoose Validation Error', [error.errors]);
      }

      if (error instanceof Error) {
        throw new InternalServerError('Transaction Failed');
      }

      throw new InternalServerError('Unknown Transaction Error');
    } finally {
      session.endSession();
    }
  }

  // All retries exhausted
  session.endSession();
  throw new InternalServerError('Transaction failed after retries');
};

// Store tags in DB
const storeTagsInDB = async (tags: string[]): Promise<string[]> => {
  try {
    const existingTags = await Tags.find({ tagTitle: { $in: tags } }).lean<
      ITagsArray[]
    >();

    // if all tags are already in db
    if (existingTags.length === tags.length) {
      return existingTags.map((t) => t._id.toString());
    }

    // filter new tags
    const existingTagTitles = new Set(existingTags.map((t) => t.tagTitle));
    const newTags = tags.filter((tag) => !existingTagTitles.has(tag));

    let createdTags: ITagsArray[] = [];

    if (newTags.length > 0) {
      // insert new tags in dv
      const insertedDocs = await Tags.insertMany(
        newTags.map((tag) => ({ tagTitle: tag })),
        { ordered: false }
      );

      // documents to plain objects causs ts is giving me nightmare
      createdTags = insertedDocs.map((doc) => ({
        _id: doc._id as mongoose.Types.ObjectId,
        tagTitle: doc.tagTitle,
      }));
    }

    // combine existing & newly created tags
    const sendTags = [
      ...existingTags.map((t) => t._id.toString()),
      ...createdTags.map((t) => t._id.toString()),
    ];

    return sendTags;
  } catch (error) {
    if (error instanceof Error && process.env.NODE_ENV === 'development') {
      logger.error({ err: error }, 'Error storing tags in database');
      throw new InternalServerError();
    }
    // return empty arrays causs the transaction function expects id so sending title is not good
    return [];
  }
};

export const getAllContents = asyncHandler(async (req, res) => {
  if (!req.user || !('_id' in req.user))
    throw new NotFoundError('User not found');

  logger.info({ userId: req.user._id }, 'Get all contents request');

  const cachedContents = await getValueFromCache(
    'user',
    req.user._id as string
  );

  // if content is already in cache then return
  if (cachedContents) {
    logger.debug({ userId: req.user._id }, 'Contents served from cache');
    return res
      .status(200)
      .json(new ApiResponse(200, 'Contents found', cachedContents));
  }

  // Get all contents
  const contents = await Content.find({ userId: req.user._id })
    .populate<{ tags: ITagsArray[] }>({ path: 'tags', select: 'tagTitle' })
    .populate<{
      link: { originalLink: string };
    }>({ path: 'link', select: 'originalLink' })
    .lean<TLeanContent[]>();

  if (!contents || contents.length === 0)
    throw new NotFoundError('No Contents Available');

  const sanitizedContents = contents.map((content) => {
    // Object.entries(content).forEach(([key, value]) => {
    //   return `${key}: ${value}`;
    // })
    logger.debug(
      { contentId: String(content._id) },
      'Processing content for tags'
    );

    // user not needed here; keep response minimal
    return {
      id: String(content._id),
      title: content.title,
      type: content.type,
      link: content.link.originalLink,
      tags: content.tags?.map((tag) => tag.tagTitle) || [],
      image: content.image || NO_IMAGE,
    };
  });

  await setValueToCache('user', req.user._id as string, sanitizedContents);

  logger.info(
    { userId: req.user._id, count: sanitizedContents.length },
    'Contents retrieved from database and cached'
  );

  return res
    .status(200)
    .json(new ApiResponse(200, 'Contents found', sanitizedContents));
});

export const addContent = asyncHandler(async (req, res) => {
  const { title = null, link, type, tags } = req.body as TBody;

  if (!req.user || !('_id' in req.user))
    throw new NotFoundError('User not found');

  logger.info({ userId: req.user._id, type }, 'Add content request');

  // Get hashed Link
  const hashedLink: string = generateHash(link);

  // Check if content already exists
  const existingContent = await Links.findOne({
    $and: [{ userId: req.user._id }, { hashedLink }],
  }).lean();

  if (existingContent) {
    logger.warn({ userId: req.user._id, link }, 'Content already exists');
    throw new ConflictError('Content already exists');
  }

  // Store tags in DB
  let saveTags: string[] = [];
  if (tags && tags.length > 0) {
    saveTags = await storeTagsInDB(tags);
  }

  // Create Transaction Session
  const session = await mongoose.startSession();

  const responseData = await executeTransactions(
    title,
    type,
    saveTags,
    link,
    hashedLink,
    req.user,
    session,
    3
  );

  logger.info(
    { userId: req.user._id, contentId: responseData.id, type },
    'Content added successfully'
  );

  res
    .status(201)
    .json(new ApiResponse(201, 'Content added successfully', responseData));

  // err are caught locally so they dont propagate to Express middleware
  // run this in background
  void (async () => {
    try {
      // From here need to delete contents from cache ---
      // First delete for actual user
      await deleteValueFromCache('user', req.user?._id as string);

      // Then delete for shared user
      const sharedContent = await Share.findOne({
        userId: req.user?._id,
        share: true,
      }).lean();
      // if content is shared then delete from cache
      if (sharedContent)
        await deleteValueFromCache('share', sharedContent?.token);
    } catch (error) {
      logger.error({ err: error }, 'Failed to delete share cache');
    }
  })();
});

export const deleteContent = asyncHandler(async (req, res) => {
  const { contentId } = req.body;

  if (!req.user || !('_id' in req.user)) throw new UnauthorizedError();

  logger.info({ userId: req.user._id, contentId }, 'Delete content request');

  // Check if content exists & delete
  const doesContentExist = await Content.findByIdAndDelete(contentId);

  if (!doesContentExist) {
    logger.warn(
      { userId: req.user._id, contentId },
      'Content not found for deletion'
    );
    throw new NotFoundError('Content not found');
  }

  // Delete link
  await Links.deleteOne({
    $and: [{ userId: req.user._id }, { _id: doesContentExist.link }],
  });

  logger.info(
    { userId: req.user._id, contentId },
    'Content deleted successfully'
  );

  res
    .status(200)
    .json(new ApiResponse(200, 'Content deleted successfully', {}));

  // err are caught locally so they dont propagate to Express middleware
  // run this in background
  void (async () => {
    try {
      // From here need to delete contents from cache ---
      // First delete for actual user
      await deleteValueFromCache('user', req.user?._id as string);

      // Then delete for shared user
      const sharedContent = await Share.findOne({
        userId: req.user?._id,
        share: true,
      }).lean();
      // if content is shared then delete from cache
      if (sharedContent)
        await deleteValueFromCache('share', sharedContent?.token);
    } catch (error) {
      logger.error({ err: error }, 'Failed to delete share cache');
    }
  })();
});

export const shareableLink = asyncHandler(async (req, res) => {
  logger.info({ userId: req.user?._id }, 'Shareable link request');

  const findUser = await User.findById(req.user?._id)
    .select('-password')
    .lean();

  if (!findUser) throw new NotFoundError('User not found');

  //Check iif User already has a shareable link
  const findShare = await Share.findOne({
    userId: findUser._id,
    share: true,
    token: { $exists: true },
  }).lean();

  if (findShare) {
    logger.info({ userId: findUser._id }, 'Shareable link already exists');
    return res.status(200).json(
      new ApiResponse(200, 'Shareable link already exists', {
        link: findShare.shareLink,
      })
    );
  }

  // Get all contents of the user
  const getUserContents = await Content.find({ userId: findUser._id });

  if (!getUserContents || getUserContents.length === 0)
    throw new NotFoundError('No Contents Available');

  // Generate tokens for shareable link
  const token = generateShareableLink();

  // Create shareable link
  const createLink = `${process.env.BASE_URL}/api/v1/share/${token}`;

  // Update the Share document of the user
  const updateShareContent = await Share.create({
    userId: findUser._id,
    share: true,
    shareLink: createLink,
    token,
  });

  if (!updateShareContent) throw new InternalServerError('Server Error');

  logger.info(
    { userId: findUser._id, token },
    'Shareable link created successfully'
  );

  return res.status(200).json(
    new ApiResponse(200, 'Shareable link created successfully', {
      link: createLink,
    })
  );
});

export const disableShareableLink = asyncHandler(async (req, res) => {
  const userShareContent = await Share.findOneAndUpdate(
    {
      userId: req.user?._id,
      share: true,
    },
    {
      share: false,
      shareLink: undefined,
      token: undefined,
    }
  ).lean();

  if (!userShareContent) throw new NotFoundError('Shareable link not found');

  logger.info(
    { userId: req.user?._id },
    'Shareable link disabled successfully'
  );
  res
    .status(200)
    .json(new ApiResponse(200, 'Shareable link disabled successfully', {}));

  void (async () => {
    try {
      await deleteValueFromCache('share', userShareContent?.token);
    } catch (error) {
      logger.error({ err: error }, 'Failed to delete share cache');
    }
  })();
});

export const getSharedContents = asyncHandler(async (req, res) => {
  const { contentToken } = req.params;

  if (!contentToken) throw new UnauthorizedError();

  logger.info({ contentToken }, 'Get shared contents request');

  const cachedContents = await getValueFromCache('share', contentToken);

  // Check if data is already in cache & if not found then go to DB
  if (cachedContents) {
    logger.debug({ contentToken }, 'Shared contents served from cache');
    return res
      .status(200)
      .json(new ApiResponse(200, 'Contents found', cachedContents));
  }

  // Check if share link is valid and also the shared user has share turned on if not then the link is not valid
  const findShare = await Share.findOne({
    $and: [{ share: true }, { token: contentToken }],
  })
    .populate<{ userId: IUser }>({ path: 'userId' })
    .lean();

  if (!findShare) {
    logger.warn({ contentToken }, 'Share not found');
    throw new NotFoundError('Share not found');
  }

  // Find all contents of the shared user
  const findContents = await Content.find({ userId: findShare?.userId })
    .populate<{ link: ILinks }>({ path: 'link', select: 'originalLink' })
    .populate<{ tags: ITags }>({ path: 'tags', select: 'tagTitle' })
    .lean<TLeanContent[]>();

  if (!findContents || findContents.length === 0)
    throw new NotFoundError('Contents not found');

  const sanatizedResponse = {
    name: findShare.userId?.name ?? 'Unknown',
    contents: findContents.map((content) => {
      return {
        title: content.title,
        type: content.type,
        link: content.link.originalLink,
        tags: content.tags.map((t) => t.tagTitle),
        image: content.image,
      };
    }),
  };

  // Add data to cache
  await setValueToCache('share', contentToken, sanatizedResponse);

  logger.info(
    {
      contentToken,
      ownerId: findShare.userId._id,
      contentCount: findContents.length,
    },
    'Shared contents retrieved and cached'
  );

  return res
    .status(200)
    .json(new ApiResponse(200, 'Contents found', sanatizedResponse));
});
