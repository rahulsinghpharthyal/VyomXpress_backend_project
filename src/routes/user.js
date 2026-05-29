import { Router } from 'express';
import auth from '../middleware/auth.js';
import { getOne, me } from '../controllers/userController.js';

const router = Router();

router.get('/me', auth, me);
router.get('/:username', auth, getOne);

export default router;
