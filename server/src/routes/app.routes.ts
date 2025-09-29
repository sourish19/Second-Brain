import { Router } from 'express';

const router = Router();

router.route('/get').get((req, res) => {
  res.send('Hello');
});

// router.route('/auth/register').post()
// router.route('/auth/login').post()

export default router;
