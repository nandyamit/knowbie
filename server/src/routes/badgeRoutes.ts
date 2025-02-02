// routes/badgeRoutes.ts
import express from 'express';
import { getUserBadges } from '../controllers/badgeController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/badges/:userId', authenticateToken, getUserBadges);

export default router;