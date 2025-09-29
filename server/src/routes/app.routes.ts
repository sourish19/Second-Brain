import { Router } from 'express';
import passport from 'passport';

import passportConfig from '../config/passport.config';
import { registerUser, loginUser } from '../controllers/auth.controller';

const router = Router();

router.route('/get').get((req, res) => {
  res.send('Hello');
});

router.route('/auth/register').post(registerUser);
router
  .route('/auth/login')
  .post(passportConfig.authenticate('local'), loginUser);

export default router;
