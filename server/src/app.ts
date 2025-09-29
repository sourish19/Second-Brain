import express, { json, urlencoded } from 'express';
import session from 'express-session';
import passport from 'passport';

import router from './routes/app.routes';

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));

if (!process.env.SESSION_SECRET)
  throw new Error('SESSION_SECRET is not defined');

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/v1', router);

export default app;
