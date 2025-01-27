import { Router } from 'express';
import { authController } from '../controllers/auth';
import { authMiddleware } from '../middleware/auth';
import { User } from '../models/user';

const router = Router();

router.post('/register', (req, res) => {
  console.log('Register route hit', req.body);
  authController.register(req, res);
});

router.post('/login', authController.login);

router.get('/validate-token', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ valid: true, user: { id: user.id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Token validation failed' });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ id: user.id, username: user.username, email: user.email });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export const authRoutes = router;