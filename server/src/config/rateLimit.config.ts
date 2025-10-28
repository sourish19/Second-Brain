import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

import { TooManyRequests } from '../utils/apiError.util';
import ENV from './env.config';

export const globalLimiter =
  ENV.NODE_ENV === 'production'
    ? rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per window
        message:
          'Too many requests from this IP, please try again after 15 minutes',
        standardHeaders: true,
        legacyHeaders: false,
        handler: (req: Request, _res: Response, next: NextFunction) => {
          // Create a custom error
          const resetTime = req?.rateLimit?.resetTime;
          const errorMessage = `You have exceeded the rate limit. Try again at ${resetTime?.toLocaleTimeString()}`;

          next(new TooManyRequests(errorMessage));
        },
      })
    : (_req: Request, _res: Response, next: NextFunction) => next();

export const authLimiter =
  ENV.NODE_ENV === 'production'
    ? rateLimit({
        windowMs: 15 * 60 * 1000, // 15 min
        limit: 5, // 5 requests per 15 min for the same IP
        skipSuccessfulRequests: false,
        message:
          'Too many requests from this IP, please try again after 15 minutes',
        standardHeaders: true,
        legacyHeaders: false,
        handler: (req: Request, _res: Response, next: NextFunction) => {
          // Create a custom error
          const resetTime = Number(req?.rateLimit?.resetTime);

          const diffMs = resetTime - Number(new Date());

          const diffMin = Math.ceil(diffMs / 60000);

          const errorMessage = `You have exceeded the rate limit. Try again in ${diffMin} min`;

          next(new TooManyRequests(errorMessage));
        },
      })
    : (_req: Request, _res: Response, next: NextFunction) => next();
