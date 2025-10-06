import { Router } from 'express';

import {
  registerUser,
  loginUser,
  logoutUser,
  handleGoogleAuthLogin,
} from '../controllers/auth.controller';
import { addContent } from '../controllers/content.controller';
import ValidateData from '../middlewares/validation.middleware';
import { userSchemaValidation } from '../validations/auth.validation';
import { contentSchemaValidation } from '../validations/content.validation';
import isLoggedIn from '../middlewares/isLoggedIn.middleware';

const router = Router();

router.route('/get').get((req, res) => {
  res.send('Hello');
});

// Auth
router
  .route('/users/register')
  .post(ValidateData(userSchemaValidation), registerUser);
router
  .route('/users/login')
  .post(ValidateData(userSchemaValidation), loginUser);
router.route('/users/logout').post(logoutUser);
router.route('/users/google/callback').get(handleGoogleAuthLogin);

// Contents
router
  .route('/add-content')
  .post(isLoggedIn, ValidateData(contentSchemaValidation), addContent);

export default router;
