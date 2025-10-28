import { Router } from 'express';

import {
  registerUser,
  loginUser,
  getUser,
  logoutUser,
  handleGoogleAuthLogin,
} from '../controllers/auth.controller';
import {
  addContent,
  getAllContents,
  deleteContent,
  getSharedContents,
  shareableLink,
} from '../controllers/content.controller';

import ValidateData from '../middlewares/validation.middleware';
import { userSchemaValidation } from '../validations/auth.validation';
import {
  contentSchemaValidation,
  contentIdValidation,
} from '../validations/content.validation';

import isLoggedIn from '../middlewares/isLoggedIn.middleware';
import { authLimiter } from '../config/rateLimit.config';

const router = Router();

router.route('/get').get((_req, res) => {
  res.send('Hello');
});

// Auth
router
  .route('/users/register')
  .post(authLimiter, ValidateData(userSchemaValidation), registerUser);
router
  .route('/users/login')
  .post(authLimiter, ValidateData(userSchemaValidation), loginUser);
router
  .route('/users/getme')
  .get(authLimiter, isLoggedIn, getUser);
router.route('/users/logout').post(logoutUser);
router.route('/users/google/callback').get(handleGoogleAuthLogin);

// Contents
router
  .route('/add-content')
  .post(isLoggedIn, ValidateData(contentSchemaValidation), addContent);
router.route('/get-contents').get(isLoggedIn, getAllContents);
router
  .route('/delete-content')
  .delete(isLoggedIn, ValidateData(contentIdValidation), deleteContent);
router.route('/share').post(isLoggedIn, shareableLink);
router.route('/share/:contentToken').get(isLoggedIn, getSharedContents);

export default router;
