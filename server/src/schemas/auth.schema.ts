import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcrypt';

import logger from '../config/logger.config';
import { LOGIN_TYPES, AVAILABLE_LOGIN_TYPES } from '../utils/constants.util';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  loginType?: string;
  // isModified(path: string):boolean  Its already there in the Document
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: [3, 'Name must be at least 3 characters long'],
      max: 10,
    },
    email: {
      unique: true,
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      min: [8, 'Password must be at least 8 characters long'],
      max: 20,
    },
    loginType: {
      type: String,
      enum: AVAILABLE_LOGIN_TYPES,
      default: LOGIN_TYPES.EMAIL_PASSWORD,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  const user: IUser = this;
  if (!user.isModified('password')) return next();
  try {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    next();
  } catch (error) {
    logger.error({ err: error }, 'Error occured while hashing password');
    next();
  }
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
