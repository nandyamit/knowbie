// routes/test.ts
import express from 'express';
import { saveTestScore, getTestAttempts } from '../controllers/testController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Protected routes
router.post('/score', authMiddleware, saveTestScore);
router.get('/attempts/:userId/:category', authMiddleware, getTestAttempts);

export const testRoutes = router;