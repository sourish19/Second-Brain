import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../schemas/auth.schema';

import asyncHandler from '../utils/asyncHandler.util';
import {
  ForbiddenError,
  InternalServerError,
  ConflictError,
  NotFoundError,
} from '../utils/apiError.util';
import { cookieOptions } from '../utils/constants.util';

import ApiResponse from '../utils/apiResponse.util';

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const findUser = await User.findOne({
    email,
  });

  if (findUser) {
    throw new ConflictError('User already exists');
  }

  const newUser = await User.create({
    name,
    email,
    password,
  });

  await newUser.save({ validateBeforeSave: true });

  return res.status(200).json(
    new ApiResponse(200, 'User registered successfully', {
      name: newUser.name,
      email: newUser.email,
    })
  );
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const findUser = await User.findOne({
    email,
  });

  if (!findUser) {
    throw new NotFoundError('User not found');
  }

  const isPasswordCorrect = await bcrypt.compare(password, findUser.password);

  if (!isPasswordCorrect) {
    throw new ForbiddenError('Inavlid credentials');
  }

  if (!process.env.JWT_SECRET) {
    throw new InternalServerError('Server error');
  }

  const token = jwt.sign({ id: findUser._id }, process.env.JWT_SECRET, {
    expiresIn: '2d',
  });

  return res
    .status(200)
    .cookie('token', token, cookieOptions)
    .json(
      new ApiResponse(200, 'User logged in successfully', {
        name: findUser.name,
        email: findUser.email,
      })
    );
});

export const logoutUser = asyncHandler(async (req, res) => {
  return res
    .clearCookie('token', cookieOptions)
    .json(new ApiResponse(200, 'Logout successfull', {}));
});

// TODO: Need to implement this
export const handleGoogleAuthLogin = asyncHandler(async (req, res) => {
  return res;
});
