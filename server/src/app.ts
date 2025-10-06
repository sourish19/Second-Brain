import express, { json, urlencoded } from 'express';

import router from './routes/app.routes';
import errorHandler from './middlewares/error.middleware';
import { NotFoundError } from './utils/apiError.util';

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));

app.use('/api/v1', router);

// Not found any route
app.use('*', (req, res, next) => {
    const message = process.env.NODE_ENV === 'production' ? 'Route not found' : `Route not found ${req.originalUrl}`;
  next(new NotFoundError(message))
});

app.use(errorHandler);

export default app;
