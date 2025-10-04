// import type { Request, Response, NextFunction } from 'express';
// import ApiError from '../utils/apiError.util';
// import { MongooseError } from 'mongoose';

// interface ApiErrorBody<T = any> {
//   statusCode: number;
//   success: boolean;
//   message: string;
//   error: T[];
//   data: unknown[];
// }

// const customErrorResponse = (
//   error: any,
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Response => {
//   console.log('This is error', error);
//   console.log('Is this true', error instanceof MongooseError);

//   const err =
//     error instanceof ApiError
//       ? error
//       : new ApiError(500, 'Internal Server Error', [], []);
//   console.log('Hi hhhh');

//   const body: ApiErrorBody = {
//     statusCode: err.status,
//     success: err.success,
//     message: err.message,
//     error: err.error,
//     data: err.data,
//   };
//   console.log('Here');

//   return res.status(err.status).json(body);
// };

// export default customErrorResponse;

import type { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/apiError.util';

const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.log('hiiiiiiiii',error);

  if (error instanceof ApiError) {
    res.status(error.status).json({
      success: error.success,
      message: error.message,
      error: error.error,
      data: error.data,
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: error.message || 'Internal Server Error',
    error: [],
    data: [],
  });
};

export default errorHandler;
