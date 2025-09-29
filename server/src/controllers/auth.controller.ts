import User from '../schemas/auth.schema';
import asyncHandler from '../utils/asyncHandler.util';
import ApiError from '../utils/apiError.util';
import ApiResponse from '../utils/apiResponse.util';

export const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const findUser = await User.findOne({
    $and: [{ name }, { email }],
  });

  if (findUser) {
    throw new ApiError(401, 'User already registered');
  }

  const newUser = await User.create({
    name,
    email,
    password,
  });

  newUser.save({ validateBeforeSave: true });

  res.status(200).json(new ApiResponse(200, 'User registered successfully'));
});

export const loginUser = asyncHandler(async (req, res) => {});
