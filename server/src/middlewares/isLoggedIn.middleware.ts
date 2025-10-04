import jwt from 'jsonwebtoken';

import ApiError from '../utils/apiError.util';
import asyncHandler from '../utils/asyncHandler.util';
import User from '../schemas/auth.schema';

const isLoggedIn = asyncHandler(async (req, res, next) => {
  const { token } = req.cookies as { token: string };

  if (!token) throw new ApiError(400, 'Unauthorized request');

  try {
    const validJwt = jwt.verify(token, process.env.JWT_SECRET!) as {id:string}

    if (!validJwt) throw new ApiError(400, 'Unauthorized request');

    const findUser = await User.findById(validJwt.id)

    if(!findUser) throw new ApiError(404,'Unauthorized ')

    req.user = findUser
  } catch (error) {
    throw error;
  }
  next();
});

export default isLoggedIn;
