import passport from 'passport';
import { Strategy } from 'passport-local';
import bcrypt from 'bcrypt';

import User from '../schemas/auth.schema';

export default passport.use(
  new Strategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await User.findOne({ email });

      if (!user) return done(null, false, { message: 'User not found' });

      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect)
        return done(null, false, { message: 'Inavlid credentials' });

      return done(null, user._id);
    } catch (error) {
      done(error, false);
    }
  })
);

passport.serializeUser((id, done) => {
  done(null, id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById({ _id: id });
    if (!user) done(null, false);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
