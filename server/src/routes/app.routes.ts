import { Router } from 'express';

import { registerUser, loginUser, logoutUser,handleGoogleAuthLogin } from '../controllers/auth.controller';

const router = Router();

router.route('/get').get((req, res) => {
  res.send('Hello');
});

router.route('/users/register').post(registerUser);
router.route('/users/login').post(loginUser);

router.route('/users/google/callback').get(handleGoogleAuthLogin)

export default router;
