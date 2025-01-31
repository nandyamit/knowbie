// server/src/routes/openai.ts
import express from 'express';
import { openAiController } from '../controllers/openai';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Add a debug log route
router.get('/test', (req, res) => {
  console.log('Test route hit');
  res.json({ message: 'OpenAI route working' });
});

// Add logging to the explain route
router.post('/explain', authMiddleware, (req, res, next) => {
  console.log('Explain route hit before auth:', req.body);
  next();
}, openAiController.explainAnswer);

export default router;