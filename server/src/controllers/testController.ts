// controllers/testController.ts
import { Request, Response } from 'express';
import { TestAttempt } from '../models/testAttempt';
import { sequelize } from '../config/database';
import { ValidationError, DatabaseError } from 'sequelize';

export const saveTestScore = async (req: Request, res: Response) => {
  console.log('----------------------------------------');
  console.log('Received score save request');
  console.log('Request body:', req.body);
  console.log('Auth user:', req.user);
  
  const t = await sequelize.transaction();

  try {
    const { category, score, totalQuestions, correctAnswers, wrongAnswers } = req.body;
    const userId = req.body.userId || req.user?.userId; // Use userId from token if not in body

    if (!userId) {
      throw new Error('User ID not found in request or token');
    }

    console.log('Creating test attempt with data:', {
      userId,
      category,
      score,
      totalQuestions,
      correctAnswers,
      wrongAnswers
    });

    const testAttempt = await TestAttempt.create({
      userId,
      category,
      score,
      totalQuestions,
      correctAnswers,
      wrongAnswers,
      dateTaken: new Date()
    }, { transaction: t });

    console.log('Test attempt created successfully:', testAttempt.toJSON());

    await t.commit();
    console.log('Transaction committed');
    
    res.status(200).json(testAttempt);
  } catch (error: unknown) {
    await t.rollback();
    console.log('Transaction rolled back');

    console.error('Error saving test score:', error);
    
    if (error instanceof DatabaseError && error.message.includes('foreign key constraint')) {
      return res.status(400).json({
        error: 'Invalid user ID',
        details: 'The provided user ID does not exist'
      });
    }

    if (error instanceof ValidationError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.message
      });
    }
    
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ 
      error: 'Failed to save test score',
      details: errorMessage
    });
  }
  console.log('----------------------------------------');
};