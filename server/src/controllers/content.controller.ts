import crypto from 'node:crypto';

import User from '../schemas/auth.schema';
import Content from '../schemas/content.schema';
import Links from '../schemas/links.schema';
import {
  NotFoundError,
  ConflictError,
  InternalServerError,
} from '../utils/apiError.util';
import ApiResponse from '../utils/apiResponse.util';
import asyncHandler from '../utils/asyncHandler.util';
import getPreview from '../utils/preview.util';

// This is only for sending data to the frontend
export interface IPreviewLink {
  id: string;
  title: string;
  type: string;
  link: string;
  tags: string[];
  image: string | null;
}

export const getAllContents = asyncHandler(async (req, res) => {
  const findUser = await User.findById(req.user?._id).select('-password');

  if (!findUser) throw new NotFoundError('User not found');

  const contents = await Content.find({ userId: findUser._id });

  if (!contents || contents.length === 0)
    throw new NotFoundError('Contents not found');

  res.status(200).json(new ApiResponse(200, 'Contents found', contents));
});

// NEED TO ADD TAGS & TYPES LATER AND ALSO SAVE IMAGE PREVIEW FOR WHEN USER HITS getAllContents
export const addContent = asyncHandler(async (req, res) => {
  const { title, link, type, tags } = req.body as {
    title: string;
    link: string;
    type: string;
    tags?: string[];
  };

  const findUser = await User.findById(req.user?._id).select('-password');

  if (!findUser) throw new NotFoundError('User not found');

  const hashedLink = crypto
    .createHash('sha256')
    .update(link)
    .digest('hex')
    .toString();

  const existingContent = await Links.findOne({
    $and: [{ userId: findUser._id }, { hashedLink }],
  });

  if (existingContent) throw new ConflictError('Content already exists');

  // Create Links document for the original link
  const linkDoc = await Links.create({
    userId: findUser._id,
    originalLink: link,
    hashedLink,
  });

  const newContent = await Content.create({
    userId: findUser._id,
    title,
    type,
    link: linkDoc._id,
    tags,
  });

  if (!newContent) throw new InternalServerError('Server error');

  await newContent.save({ validateBeforeSave: true });

  const previewData = await getPreview(link);

  // Build response safely
  const responseData: IPreviewLink = {
    id: String(newContent._id),
    title: newContent.title ?? previewData?.title,
    type: newContent.type,
    link,
    image: previewData?.image ?? '',
    tags: Array.isArray(newContent.tags)
      ? newContent.tags.map((t) => String(t))
      : [],
  };

  res
    .status(201)
    .json(new ApiResponse(201, 'Content added successfully', [responseData]));
});

export const deleteContent = asyncHandler(async (req, res) => {
  const { contentId } = req.body;

  const findUser = await User.findById(req.user?._id).select('-password');

  if (!findUser) throw new NotFoundError('User not found');

  const doesContentExist = await Content.findByIdAndDelete(contentId);

  if (!doesContentExist) throw new NotFoundError('Content not found');

  const deleteLink = await Links.deleteOne({
    $and: [{ userId: findUser._id }, { _id: doesContentExist.link }],
  });

  res.status(200).json(new ApiResponse(200, 'Content deleted successfully'));
});
