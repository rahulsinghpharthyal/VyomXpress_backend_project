import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { signup, login } from '../controllers/authController.js';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many attempts, try again later' },
});

router.post('/signup', authLimiter, signup);
router.post('/login', authLimiter, login);

export default router;
