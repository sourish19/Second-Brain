import express, { json, urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import router from './routes/app.routes';
import errorHandler from './middlewares/error.middleware';
import { NotFoundError } from './utils/apiError.util';

import corsConfig from './config/cors.config';
import { globalLimiter } from './config/rateLimit.config';

const app = express();

app.use(corsConfig());

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());

app.use(globalLimiter);

app.use('/api/v1', router);

// Not found any route --> /{*any} will work in express 5 otherwise * will work
app.use('/{*any}', (req, res, next) => {
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Route not found'
      : `Route not found ${req.originalUrl}`;
  next(new NotFoundError(message));
});

app.use(errorHandler);

export default app;
