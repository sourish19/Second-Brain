import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/apiError.util';

const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (error instanceof ApiError) {
    res.status(error.status).json({
      success: error.success,
      message: error.message,
      code: error.code,
      error: error.error,
      data: error.data,
    });
    return;
  }
  res.status(500).json({
    success: false,
    message: error.message || 'Internal Server Error',
    code: 'INTERNAL_SERVER_ERROR',
    error: [],
    data: [],
  });
};

export default errorHandler;
