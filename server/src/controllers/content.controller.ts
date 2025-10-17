import mongoose from 'mongoose';

import User from '../schemas/auth.schema';
import Content from '../schemas/content.schema';
import Links from '../schemas/links.schema';
import Share from '../schemas/share.schema';
import { IUser } from '../schemas/auth.schema';
import { ILinks } from '../schemas/links.schema';

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
  tags: string[] | undefined,
  link: string,
  hashedLink: string,
  user: IUser,
  session: mongoose.ClientSession,
  retryCount: number
) => Promise<IPreviewLink>;

// Transction login
const executeTransactions: TExecuteSession = async (
  title,
  type,
  tags,
  link,
  hashedLink,
  user,
  session,
  retryCount = 3
) => {
  while (retryCount > 0) {
    try {
      await session.startTransaction();

      const linkDoc = new Links({
        userId: user._id,
        originalLink: link,
        hashedLink,
      });
      await linkDoc.save({ session });

      const previewData = await getPreview(link);

      const newContent = new Content({
        userId: user._id,
        title: title || previewData?.title || 'Title',
        image: previewData?.image || NO_IMAGE,
        type,
        link: linkDoc._id,
        tags,
      });
      await newContent.save({ session });

      await session.commitTransaction();

      return {
        id: String(newContent._id),
        title: newContent.title,
        type: newContent.type,
        link: linkDoc.originalLink,
        image: newContent.image || NO_IMAGE,
        tags: Array.isArray(newContent.tags)
          ? newContent.tags.map((t) => String(t))
          : [],
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
    }
  }

  // All retries exhausted
  session.endSession();
  throw new InternalServerError('Transaction failed after retries');
};

export const getAllContents = asyncHandler(async (req, res) => {
  const findUser = await User.findById(req.user?._id).select('-password');

  if (!findUser) throw new NotFoundError('User not found');

  // Get all contents
  const contents = await Content.find({ userId: findUser._id }).lean();

  if (!contents || contents.length === 0)
    throw new NotFoundError('No Contents Available');

  return res.status(200).json(new ApiResponse(200, 'Contents found', contents));
});

export const addContent = asyncHandler(async (req, res) => {
  const { title = null, link, type, tags } = req.body as TBody;

  // Find the user who is adding the content
  const findUser = await User.findById(req.user?._id)
    .select('-password')
    .lean();

  if (!findUser) throw new NotFoundError('User not found');

  // Get hashed Link
  const hashedLink: string = generateHash(link);

  // Check if content already exists
  const existingContent = await Links.findOne({
    $and: [{ userId: findUser._id }, { hashedLink }],
  }).lean();

  if (existingContent) throw new ConflictError('Content already exists');

  // Create Transaction Session
  const session = await mongoose.startSession();

  const responseData = await executeTransactions(
    title,
    type,
    tags,
    link,
    hashedLink,
    findUser,
    session,
    3
  );

  return res
    .status(201)
    .json(new ApiResponse(201, 'Content added successfully', responseData));
});

export const deleteContent = asyncHandler(async (req, res) => {
  const { contentId } = req.body;

  // Find user
  const findUser = await User.findById(req.user?._id)
    .select('-password')
    .lean();

  if (!findUser) throw new NotFoundError('User not found');

  // Check if content exists & delete
  const doesContentExist = await Content.findByIdAndDelete(contentId);

  if (!doesContentExist) throw new NotFoundError('Content not found');

  // Delete link
  const deleteLink = await Links.deleteOne({
    $and: [{ userId: findUser._id }, { _id: doesContentExist.link }],
  });

  return res
    .status(200)
    .json(new ApiResponse(200, 'Content deleted successfully', {}));
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

export const getSharedContents = asyncHandler(async (req, res, next) => {
  const { contentToken } = req.params;

  if (!contentToken) throw new UnauthorizedError();

  // Check if share link is valid and also the shared user has share turned on if not then the link is not valid
  const findShare = await Share.findOne({
    $and: [{ share: true }, { token: contentToken }],
  })
    .populate<{ userId: IUser }>({ path: 'userId' })
    .lean();

  if (!findShare) throw new NotFoundError('Share not found');

  // Find all contents of the shared user
  const findContents = await Content.find({ userId: findShare?.userId })
    .populate<{ link: ILinks }>({ path: 'link' })
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

  return res
    .status(200)
    .json(new ApiResponse(200, 'Contents found', sanatizedResponse));
});
