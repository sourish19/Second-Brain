import jwt from 'jsonwebtoken';

import User from '../schemas/auth.schema';

import { UnauthorizedError } from '../utils/apiError.util';
import asyncHandler from '../utils/asyncHandler.util';

const isLoggedIn = asyncHandler(async (req, res, next) => {
  const { token } = req.cookies as { token: string };

  if (!token) throw new UnauthorizedError('Unauthorized request');

  try {
    const validJwt = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };

    if (!validJwt) throw new UnauthorizedError('Unauthorized request');

    const findUser = await User.findById(validJwt.id).select('-password');

    if (!findUser) throw new UnauthorizedError('Unauthorized request');

    req.user = findUser;
  } catch (error) {
    throw error;
  }
  next();
});

export default isLoggedIn;
