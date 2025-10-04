import type{ Request,Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../schemas/auth.schema';
import asyncHandler from '../utils/asyncHandler.util';
import ApiError from '../utils/apiError.util';
import ApiResponse from '../utils/apiResponse.util';

export const registerUser = asyncHandler(async (req:Request, res:Response) => {
  const { name, email, password } = req.body;
  const findUser = await User.findOne({
    email,
  });

  if (findUser) {
    console.log('Sent');
    throw new ApiError(403, 'User already registered',[],[]);
  }
  console.log('Not sent');

  const newUser = await User.create({
    name,
    email,
    password,
  });

  await newUser.save({ validateBeforeSave: true });
  console.log('Hi there');

  res.status(200).json(new ApiResponse(200, 'User registered successfully'));
  console.log('Black');
});

export const loginUser = asyncHandler(async (req:Request, res:Response) => {
  console.log('Hjki');
  
  const { email, password } = req.body;

  const findUser = await User.findOne({
    email,
  });

  if (!findUser) {
    throw new ApiError(403, 'User not found');
  }

  const isPasswordCorrect = await bcrypt.compare(password, findUser.password);

  if (!isPasswordCorrect) {
    throw new ApiError(403, 'Inavlid credentials');
  }

  if (!process.env.JWT_SECRET) {
    throw new ApiError(500, 'Server error');
  }

  const token = jwt.sign({ id: findUser._id }, process.env.JWT_SECRET, {
    expiresIn: '2d',
  });

  res
    .status(200)
    .cookie('token', token, { httpOnly: true })
    .json(new ApiResponse(200, 'User logged in successfully'));
});

export const logoutUser = asyncHandler(async (req:Request, res:Response) => {});

export const handleGoogleAuthLogin = asyncHandler(async (req:Request, res:Response) => {});
