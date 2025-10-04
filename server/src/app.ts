import express, { json, urlencoded } from 'express';
import type{ Request,Response,NextFunction } from 'express';

import router from './routes/app.routes';
import ApiError from './utils/apiError.util';
import errorHandler from './middlewares/error.middleware';

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));

app.use('/api/v1', router);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      success: false,
      message: err.message
    });
  }
})

export default app;
