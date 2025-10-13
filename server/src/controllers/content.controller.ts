import User from '../schemas/auth.schema';
import Content from '../schemas/content.schema';
import {
  NotFoundError,
  ConflictError,
  InternalServerError,
} from '../utils/apiError.util';
import ApiResponse from '../utils/apiResponse.util';
import asyncHandler from '../utils/asyncHandler.util';

export const getAllContents = asyncHandler(async (req, res) => {});

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

  // Here I need to make the api call to get the preview and then send it to frontend

  res.status(201).json(
    new ApiResponse(201, 'Content added successfully', [
      {
        id: newContent._id,
        title: newContent.title,
        type: newContent.type,
        link: newContent.link,
        tags: newContent.tags,
      },
    ])
  );
});

export const deleteContent = asyncHandler(async (req, res) => {
  const contentId = req.params.id;

  const findUser = await User.findById(req.user?._id).select('-password');

  if (!findUser) throw new NotFoundError('User not found');

  const doesContentExist = await Content.findOne({});
});
