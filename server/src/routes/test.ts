// routes/test.ts
import express from 'express';
import { saveTestScore } from '../controllers/testController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Protected route for saving test scores
router.post('/score', authMiddleware, saveTestScore);

export const testRoutes = router;