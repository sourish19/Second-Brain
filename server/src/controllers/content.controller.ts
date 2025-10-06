import User from '../schemas/auth.schema';
import Content from '../schemas/content.schema';
import {
  NotFoundError,
  ConflictError,
  InternalServerError,
} from '../utils/apiError.util';
import asyncHandler from '../utils/asyncHandler.util';

export const addContent = asyncHandler(async (req, res) => {
  const { title, link, type, tags } = req.body as {
    title: string;
    link: string;
    type: string;
    tags?: string[];
  };

  const findUser = await User.findById(req.user?._id).select('-password');

  if (!findUser) throw new NotFoundError('User not found');

  const existingContent = await Content.findOne({
    $and: [{ userId: findUser._id }, { link }],
  });

  if (existingContent) throw new ConflictError('Content already exists');

  const newContent = await Content.create({
    userId: findUser._id,
    title,
    type,
    link,
    tags,
  });

  if (!newContent) throw new InternalServerError('Server error');

  await newContent.save({ validateBeforeSave: true });
});

export const deleteContent = asyncHandler(async (req, res) => {});
