import { Request, Response, NextFunction, RequestHandler } from 'express';

type THandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<Response>;

const asyncHandler =
  (requestHandler: THandler): RequestHandler =>
  (req, res, next) =>
    Promise.resolve(requestHandler(req, res, next)).catch(next);

export default asyncHandler;
