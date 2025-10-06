import { z, ZodError } from 'zod';
import { RequestHandler, Request, Response, NextFunction } from 'express';

import asyncHandler from '../utils/asyncHandler.util';
import { ValidationError } from '../utils/apiError.util';

const ValidateData = (schema: z.ZodSchema): RequestHandler => {
  return asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const result = schema.safeParse(req.body);
      if (result.success) next();
      if (result.error instanceof ZodError)
        throw new ValidationError(
          'Validation Error',
          [z.flattenError(result.error).fieldErrors],
          []
        );
    }
  );
};

export default ValidateData;
