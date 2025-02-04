// controllers/testController.ts
import { Request, Response } from 'express';
import { TestAttempt } from '../models/testAttempt';
import { Badge } from '../models/badge';
import { sequelize } from '../config/database';
import { ValidationError, DatabaseError } from 'sequelize';
import { checkAndAwardBadges } from './badgeController';

export const saveTestScore = async (req: Request, res: Response) => {
  console.log('----------------------------------------');
  console.log('Received score save request');
  console.log('Request body:', req.body);
  console.log('Auth user:', req.user);

  const t = await sequelize.transaction();

  try {
    const { category, score, totalQuestions, correctAnswers, wrongAnswers } = req.body;
    const userId = req.body.userId || req.user?.userId;

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

    // Badge Logic, Check if user qualifies for a badge
    // Check if this is the user's first test
    const testCount = await TestAttempt.count({
      where: { userId },
      transaction: t
    });

    if (testCount === 1) {
      console.log('User qualifies for "First Test Completed" badge');
      await Badge.create({
        userId,
        badgeType: 'first_test_completed_badge',
        earnedAt: new Date()
      }, { transaction: t });
      console.log('Badge "First Test Completed" assigned');
    }

    // Check if user scored 100
    if (score === 100) {
      const existingBadge = await Badge.findOne({
        where: { userId, badgeType: '100_score_badge' },
        transaction: t
      });

      if (!existingBadge) {
        console.log('User qualifies for "100 Score" badge');
        await Badge.create({
          userId,
          badgeType: '100_score_badge',
          earnedAt: new Date()
        }, { transaction: t });
        console.log('Badge "100 Score" assigned');
      }
    }
    // End of badge logic

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

export const getTestAttempts = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const category = req.params.category;

    const attempts = await TestAttempt.findAll({
      where: {
        userId,
        category
      },
      order: [['dateTaken', 'DESC']],
      attributes: [
        'id',
        'category',
        'score',
        'totalQuestions',
        'correctAnswers',
        'wrongAnswers',
        'dateTaken'
      ]
    });

    res.status(200).json(attempts);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({
      error: 'Failed to fetch test attempts',
      details: errorMessage
    });
  }
};