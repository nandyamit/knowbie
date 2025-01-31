// server/src/controllers/openai.ts
import { Request, Response } from 'express';
import { openAiService } from '../services/openai';

// server/src/controllers/openai.ts
export const openAiController = {
  async explainAnswer(req: Request, res: Response) {
    try {
      console.log('OpenAI controller hit - Request body:', req.body);
      const { question, answer } = req.body;

      if (!question || !answer) {
        console.log('Missing required fields:', { question, answer });
        return res.status(400).json({ error: 'Question and answer are required' });
      }

      console.log('Generating explanation for:', { question, answer });
      const explanation = await openAiService.generateExplanation(question, answer);
      console.log('Generated explanation:', explanation);
      
      res.json({ explanation });
    } catch (error) {
      console.error('OpenAI controller error:', error);
      res.status(500).json({ error: 'Failed to generate explanation' });
    }
  }
};