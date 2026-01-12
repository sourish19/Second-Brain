import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passport from 'passport';

import User from '../schemas/auth.schema';
import ENV from './env.config';
import { LOGIN_TYPES } from '../utils/constants.util';
import { BadRequestError, InternalServerError } from '../utils/apiError.util';
import logger from './logger.config';

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: ENV.GOOGLE_CLIENT_ID,
      clientSecret: ENV.GOOGLE_CLIENT_SECRET,
      callbackURL: ENV.GOOGLE_CALLBACK_URL,
    },
    // Here I am not taking Googles access & refresh token as it is only used to call googles api
    async (_, __, profile, next) => {
      try {
        // check if the user with this email exists in the db
        console.log("hello");
        
        const user = await User.findOne({ email: profile._json.email }).select(
          '-password'
        );
        logger.info(`User in GOOGLE SSO -  ${user}`);
        // if user exists
        if (user) {
          // If user is registered with some other method, we will ask the user to use the same method as registered
          if (user.loginType !== LOGIN_TYPES.GOOGLE)
            return next(
              new BadRequestError(
                'You have previously registered using ' +
                  user.loginType?.toLocaleLowerCase().split('_').join(' ') +
                  'Please use the ' +
                  user.loginType?.toLocaleLowerCase() +
                  ' login option to access to your account'
              )
            );
          else return next(null, user);
        }
        // if user dosent exists then create it
        else {
          const createdUser = await User.create({
            name: profile._json.name,
            email: profile._json.email,
            password: profile._json.sub, // Set users password as sub (coming from the google)
            loginType: LOGIN_TYPES.GOOGLE,
          });
          if (createdUser) return next(null, createdUser);
          else return next(new InternalServerError());
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          logger.error(error.message);
          return next(new InternalServerError(), false);
        }
      }
    }
  )
);
// passport automatically puts the user object in req.user so I can extract it from the next controller
