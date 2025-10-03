import express, { json, urlencoded } from 'express';

import router from './routes/app.routes';
import customErrorResponse from './middlewares/error.middleware';

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));

app.use('/api/v1', router);

app.use(customErrorResponse);

export default app;
