import type { request } from 'http';

export type ExpressMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export { Request, Response, NextFunction };
