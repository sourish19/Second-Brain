import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/apiError.util';
import logger from '../config/logger.config';

const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (error instanceof ApiError) {
    logger.warn(
      {
        method: req.method,
        url: req.originalUrl,
        status: error.status,
        code: error.code,
        error: error.error,
      },
      'Handled ApiError'
    );
    res.status(error.status).json({
      success: error.success,
      message: error.message,
      code: error.code,
      error: error.error,
      data: error.data,
    });
    return;
  }
  logger.error(
    { method: req.method, url: req.originalUrl, err: error },
    'Unhandled error'
  );
  res.status(500).json({
    success: false,
    message: error.message || 'Internal Server Error',
    code: 'INTERNAL_SERVER_ERROR',
    error: [],
    data: [],
  });
};

export default errorHandler;
