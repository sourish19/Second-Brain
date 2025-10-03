import type { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/apiError.util';

interface ApiErrorBody<T = any> {
  statusCode: number;
  success: boolean;
  message: string;
  error: T[];
  data: unknown[];
}

const customErrorResponse = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  const err =
    error instanceof ApiError
      ? error
      : new ApiError(500, 'Internal Server Error', [], []);

  const body: ApiErrorBody = {
    statusCode: err.status,
    success: err.success,
    message: err.message,
    error: err.error,
    data: err.data,
  };

  return res.status(err.status).json(body);
};

export default customErrorResponse;
