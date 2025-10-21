import { z, ZodError } from 'zod';
import { RequestHandler, Request, Response, NextFunction } from 'express';

import asyncHandler from '../utils/asyncHandler.util';
import { ValidationError } from '../utils/apiError.util';
import logger from '../config/logger.config';

const ValidateData = (schema: z.ZodSchema): RequestHandler => {
  return asyncHandler(
    async (req: Request, _res: Response, next: NextFunction) => {
      const result = schema.safeParse(req.body);
      if (result.success) next();
      if (result.error instanceof ZodError) {
        logger.warn(
          {
            path: req.originalUrl,
            method: req.method,
            issues: result.error.issues,
          },
          'Validation failed'
        );
        throw new ValidationError(
          'Validation Error',
          [z.flattenError(result.error).fieldErrors],
          []
        );
      }
    }
  );
};

export default ValidateData;
