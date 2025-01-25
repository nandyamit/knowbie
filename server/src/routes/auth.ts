// Authentication routes

import { Router } from 'express';
import { authController } from '../controllers/auth';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authMiddleware, authController.getCurrentUser);

export const authRoutes = router;