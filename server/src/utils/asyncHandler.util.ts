import { Request, Response, NextFunction, RequestHandler } from 'express';

const asyncHandler =
  (
    requestHandler: (
      req: Request,
      res: Response,
      next: NextFunction
    ) => Promise<void>
  ): RequestHandler =>
  (req, res, next) =>
    Promise.resolve(requestHandler(req, res, next)).catch(next);

export default asyncHandler;
