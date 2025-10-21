import mongoose from 'mongoose';

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

type LeanContent = {
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
        console.log('TagsId --> ', tagIds);

        tagsDoc = await Tags.find({
          _id: { $in: tagIds },
        }).lean();

        console.log('TagsDoc --> ', tagsDoc);
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

      if (process.env.NODE_ENV === 'development') {
        console.error('Transaction Failed --> ', error);
      }

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
      console.error('Error in storeTagsInDB -->', error);
    }
    // return empty arrays causs the transaction function expects id so sending title is not good
    return [];
  }
};

export const getAllContents = asyncHandler(async (req, res) => {
  if (!req.user || !('_id' in req.user))
    throw new NotFoundError('User not found');

  const cachedContents = await getValueFromCache(
    'user',
    req.user._id as string
  );

  // if content is already in cache then return
  if (cachedContents)
    return res
      .status(200)
      .json(new ApiResponse(200, 'Contents found', cachedContents));

  // Get all contents
  const contents = await Content.find({ userId: req.user._id })
    .populate<{ tags: ITagsArray[] }>({ path: 'tags', select: 'tagTitle' })
    .populate<{
      link: { originalLink: string };
    }>({ path: 'link', select: 'originalLink' })
    .lean<LeanContent[]>();

  if (!contents || contents.length === 0)
    throw new NotFoundError('No Contents Available');

  const sanitizedContents = contents.map((content) => {
    // Object.entries(content).forEach(([key, value]) => {
    //   return `${key}: ${value}`;
    // })
    console.log('tags -->', content);
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

  return res.status(200).json(new ApiResponse(200, 'Contents found', sanitizedContents));
});

export const addContent = asyncHandler(async (req, res) => {
  const { title = null, link, type, tags } = req.body as TBody;

  if (!req.user || !('_id' in req.user))
    throw new NotFoundError('User not found');

  // Get hashed Link
  const hashedLink: string = generateHash(link);

  // Check if content already exists
  const existingContent = await Links.findOne({
    $and: [{ userId: req.user._id }, { hashedLink }],
  }).lean();

  if (existingContent) throw new ConflictError('Content already exists');

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
      console.error('Failed to delete share cache:', error);
    }
  })();
});

export const deleteContent = asyncHandler(async (req, res) => {
  const { contentId } = req.body;

  if (!req.user || !('_id' in req.user)) throw new UnauthorizedError();

  // Check if content exists & delete
  const doesContentExist = await Content.findByIdAndDelete(contentId);

  if (!doesContentExist) throw new NotFoundError('Content not found');

  // Delete link
  const deleteLink = await Links.deleteOne({
    $and: [{ userId: req.user._id }, { _id: doesContentExist.link }],
  });

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
      console.error('Failed to delete share cache:', error);
    }
  })();
});

export const shareableLink = asyncHandler(async (req, res) => {
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

  return res.status(200).json(
    new ApiResponse(200, 'Shareable link created successfully', {
      link: createLink,
    })
  );
});

export const disableShareableLink = asyncHandler(async (req, res) => {});

export const getSharedContents = asyncHandler(async (req, res) => {
  const { contentToken } = req.params;

  if (!contentToken) throw new UnauthorizedError();

  const cachedContents = await getValueFromCache('share', contentToken);

  // Check if data is already in cache & if not found then go to DB
  if (cachedContents) {
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

  if (!findShare) throw new NotFoundError('Share not found');

  // Find all contents of the shared user
  const findContents = await Content.find({ userId: findShare?.userId })
    .populate<{ link: ILinks }>({ path: 'link', select: 'originalLink' })
    .populate<{ tags: ITags }>({ path: 'tags', select: 'tagTitle' })
    .lean();

  if (!findContents || findContents.length === 0)
    throw new NotFoundError('Contents not found');

  const sanatizedResponse = {
    name: findShare.userId?.name ?? 'Unknown',
    contents: findContents.map((content) => {
      return {
        title: content.title,
        type: content.type,
        link: content.link?.originalLink,
        tags: content.tags,
        image: content.image,
      };
    }),
  };

  // Add data to cache
  await setValueToCache('share', contentToken, sanatizedResponse);

  return res
    .status(200)
    .json(new ApiResponse(200, 'Contents found', sanatizedResponse));
});
