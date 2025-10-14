import User from '../schemas/auth.schema';
import Content from '../schemas/content.schema';
import Links from '../schemas/links.schema';
import Share from '../schemas/share.schema';
import {
  NotFoundError,
  ConflictError,
  InternalServerError,
  UnauthorizedError,
} from '../utils/apiError.util';
import ApiResponse from '../utils/apiResponse.util';
import asyncHandler from '../utils/asyncHandler.util';
import getPreview from '../utils/preview.util';
import { generateHash, generateShareableLink } from '../utils/helper.util';
import { IUser } from '../schemas/auth.schema';

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

  // Get all contents
  const contents = await Content.find({ userId: findUser._id }).lean();

  if (!contents || contents.length === 0)
    throw new NotFoundError('No Contents Available');

  res.status(200).json(new ApiResponse(200, 'Contents found', contents));
});

// TODO: NEED TO ADD TAGS & TYPES LATER
export const addContent = asyncHandler(async (req, res) => {
  const { title, link, type, tags } = req.body as {
    title?: string;
    link: string;
    type: string;
    tags?: string[];
  };

  const findUser = await User.findById(req.user?._id)
    .select('-password')
    .lean();

  if (!findUser) throw new NotFoundError('User not found');

  // Get hashed Link
  const hashedLink: string = generateHash(link);

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

  // Get the prevew data
  const previewData = await getPreview(link);

  // Create content - If user provided title then use it else use the title with the previewed data & the image
  const newContent = await Content.create({
    userId: findUser._id,
    title: title ?? previewData?.title,
    image: previewData?.image ?? '',
    type,
    link: linkDoc._id,
    tags,
  });

  if (!newContent) throw new InternalServerError('Server error');

  // Build response data
  const responseData: IPreviewLink = {
    id: String(newContent._id),
    title: newContent.title,
    type: newContent.type,
    link: linkDoc.originalLink,
    image: newContent.image,
    tags: Array.isArray(newContent.tags)
      ? newContent.tags.map((t) => String(t))
      : [],
  };

  res
    .status(201)
    .json(new ApiResponse(201, 'Content added successfully', [responseData]));
});

// TODO: CHECK SHARE ALSO IF NEEDED
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

  res.status(200).json(new ApiResponse(200, 'Content deleted successfully'));
});

export const shareableLink = asyncHandler(async (req, res) => {
  const findUser = await User.findById(req.user?._id)
    .select('-password')
    .lean();

  if (!findUser) throw new NotFoundError('User not found');

  // Get all contents of the user
  const getUserContents = await Content.find({ userId: findUser._id });

  if (!getUserContents || getUserContents.length === 0)
    throw new NotFoundError('No Contents Available');

  // Generate tokens for shareable link
  const { randomToken, hashedToken } = generateShareableLink();

  const updateShareContent = await Share.create({
    userId: findUser._id,
    share: true,
    shareLink: hashedToken,
  });

  if (!updateShareContent) throw new InternalServerError('Server Error');

  // Create shareable link
  const createLink = `${process.env.BASE_URL}/api/v1/secondbrain/share/${randomToken}`;

  res
    .status(200)
    .json(
      new ApiResponse(200, 'Shareable link created successfully', [
        { link: createLink },
      ])
    );
});

export const getSharedContents = asyncHandler(async (req, res) => {
  const { contentToken } = req.params;

  if (!contentToken) throw new UnauthorizedError();

  const hashedToken = generateHash(contentToken);

  // Check if share link is valid and also the shared user has share turned on if not then the link is not valid
  const findShare = await Share.findOne({
    $and: [{ share: true }, { shareLink: hashedToken }],
  })
    .populate<{ userId: IUser }>({ path: 'userId' })
    .lean();

  if (!findShare) throw new NotFoundError('Share not found');

  // Find all contents of the shared user
  const findContents = await Content.find({ userId: findShare?.userId }).lean();

  if (!findContents || findContents.length === 0)
    throw new NotFoundError('Contents not found');

  res.status(200).json(
    new ApiResponse(200, 'Contents found', [
      {
        name: findShare.userId?.name ?? 'Unknown',
        contents: findContents,
      },
    ])
  );
});

/*
  User clicks on share content button
  Frontend will hit /share
  Get the user 
  Get all the content for that user 
  In db make shareLink = true 
  Create a shareable link like this -> http://localhost:3000/api/v1/secondbrain/share/qbjadhqwygqywqw1212132
   - Create this gibrish token using crypto using randombytes and generate a hash for the same 
   - store the hash in the db 
   - attach the gibbrish token to the shareable link
   - send the shareable link to the user
  When frontend hit the shareadble link route
   - take the token from the param 
   - hash it then compare it with the hash in the db
   - if it matches then show the content
   - if it doesn't match then show not found
*/
