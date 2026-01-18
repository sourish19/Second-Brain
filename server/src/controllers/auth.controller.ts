import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import logger from '../config/logger.config';
import User from '../schemas/auth.schema';
import asyncHandler from '../utils/asyncHandler.util';
import {
  ForbiddenError,
  InternalServerError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from '../utils/apiError.util';
import { cookieOptions } from '../utils/constants.util';
import ENV from '../config/env.config';
import ApiResponse from '../utils/apiResponse.util';

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  logger.info({ email }, 'User registration attempt');

  const findUser = await User.findOne({
    email,
  });

  if (findUser) {
    logger.warn({ email }, 'Registration failed - user already exists');
    throw new ConflictError('User already exists');
  }

  const newUser = await User.create({
    name,
    email,
    password,
  });

  await newUser.save({ validateBeforeSave: true });

  logger.info({ userId: newUser._id, email }, 'User registered successfully');

  return res.status(200).json(
    new ApiResponse(200, 'User registered successfully', {
      name: newUser.name,
      email: newUser.email,
    })
  );
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  logger.info({ email }, 'User login attempt');

  const findUser = await User.findOne({
    email,
  });

  if (!findUser) {
    logger.warn({ email }, 'Login failed - user not found');
    throw new NotFoundError('User not found');
  }

  const isPasswordCorrect = await bcrypt.compare(password, findUser.password);

  if (!isPasswordCorrect) {
    logger.warn({ email }, 'Login failed - invalid credentials');
    throw new ForbiddenError('Inavlid credentials');
  }

  const token = jwt.sign({ id: findUser._id }, ENV.JWT_SECRET, {
    expiresIn: '2d',
  });

  logger.info({ userId: findUser._id, email }, 'User logged in successfully');

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
  logger.info({ userId: req.user?._id }, 'User logout');
  return res
    .clearCookie('token', cookieOptions)
    .json(new ApiResponse(200, 'Logout successfull', {}));
});

export const getUser = asyncHandler(async (req, res) => {
  const id = req.user?._id;

  if (!id) {
    logger.warn({ userId: id }, 'User details not found');
    throw new NotFoundError('User details not found');
  }

  const findUser = await User.findById(id).select('-password');

  if (!findUser) {
    logger.warn({ userId: id }, 'User details not found');
    throw new NotFoundError('User details not found');
  }

  return res.status(200).json(
    new ApiResponse(200, 'User details', {
      name: findUser.name,
      email: findUser.email,
    })
  );
});

export const handleGoogleAuthLogin = asyncHandler(async (req, res) => {
  if (!req.user) throw new UnauthorizedError();

  const user = await User.findById(req.user._id).select('-password');

  if (!user) throw new InternalServerError();

  const token = jwt.sign({ id: user._id }, ENV.JWT_SECRET, {
    expiresIn: '2d',
  });

  logger.info(
    { userId: user._id, email: user.email },
    'User logged using google'
  );

  return res
    .status(302)
    .cookie('token', token, cookieOptions)
    .redirect('http://localhost:3000/dashboard');
});
