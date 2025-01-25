// Authentication routes

import { Router } from 'express';
import { authController } from '../controllers/auth';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authMiddleware, authController.getCurrentUser);

export const authRoutes = router;