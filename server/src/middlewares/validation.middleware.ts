import { z, ZodError } from 'zod';
import { RequestHandler,Request,Response,NextFunction } from 'express';

import asyncHandler from '../utils/asyncHandler.util';
import ApiError from '../utils/apiError.util';

const ValidateData = (schema: z.ZodSchema): RequestHandler => {
  return asyncHandler(async (req:Request, res:Response, next:NextFunction) => {
    const result = schema.safeParse(req.body);
    if (result.success) next();
    if (result.error instanceof ZodError)
      throw new ApiError(
        422,
        'Validation Error',
        [z.flattenError(result.error).fieldErrors],
        []
      );
  });
};

export default ValidateData;
