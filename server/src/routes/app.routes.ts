import { Router } from 'express';

import {
  registerUser,
  loginUser,
  logoutUser,
  handleGoogleAuthLogin,
} from '../controllers/auth.controller';
import ValidateData from '../middlewares/validation.middleware';
import { userSchema } from '../validations/auth.validation';

const router = Router();

router.route('/get').get((req, res) => {
  res.send('Hello');
});

router.route('/users/register').post(ValidateData(userSchema), registerUser);
router.route('/users/login').post(ValidateData(userSchema), loginUser);
router.route('/users/logout').post(logoutUser);

router.route('/users/google/callback').get(handleGoogleAuthLogin);

export default router;
