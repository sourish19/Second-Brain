import jwt from 'jsonwebtoken';

import User from '../schemas/auth.schema';

import { UnauthorizedError } from '../utils/apiError.util';
import asyncHandler from '../utils/asyncHandler.util';
import logger from '../config/logger.config';

const isLoggedIn = asyncHandler(async (req, _res, next) => {
  const { token } = req.cookies as { token: string };

  if (!token) {
    logger.warn({ path: req.originalUrl }, 'Missing auth token');
    throw new UnauthorizedError('Unauthorized request');
  }

  try {
    const validJwt = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };

    if (!validJwt) {
      logger.warn({ path: req.originalUrl }, 'Invalid JWT');
      throw new UnauthorizedError('Unauthorized request');
    }

    const findUser = await User.findById(validJwt.id).select('-password');

    if (!findUser) {
      logger.warn({ userId: validJwt.id }, 'User not found for JWT');
      throw new UnauthorizedError('Unauthorized request');
    }

    req.user = findUser;
  } catch (error) {
    logger.error({ err: error }, 'Auth middleware error');
    throw error;
  }
  next();
});

export default isLoggedIn;
