// controllers/badgeController.ts
import { Request, Response } from 'express';
import { TestAttempt } from '../models/testAttempt';
import { UserBadge, BadgeType, BADGE_CRITERIA } from '../models/badge';

export const checkAndAwardBadges = async (userId: string, category: string, correctAnswers: number) => {
  const badges = [];
  
  // Get total correct answers for the specific category
  const categoryTotal = await TestAttempt.sum('correctAnswers', {
    where: { 
      userId,
      category 
    }
  }) || 0;

  // Check category-specific badges (5 correct answers in a specific category)
  if (categoryTotal + correctAnswers >= 5) {
    const categoryBadges = {
      'Film': BadgeType.SCENE_STEALER,
      'Books': BadgeType.BOOKWORM_ELITE,
      'Music': BadgeType.RHYTHM_MASTER
    };
    
    const badgeType = categoryBadges[category as keyof typeof categoryBadges];
    if (badgeType) {
      badges.push(badgeType);
    }
  }

  // Get total correct answers across all categories
  const totalCorrect = await TestAttempt.sum('correctAnswers', { 
    where: { userId }
  }) || 0;

  // Add current attempt's correct answers to total
  const grandTotal = totalCorrect + correctAnswers;

  // Check total answer badges in descending order
  if (grandTotal >= 15) {
    badges.push(BadgeType.TRIPLE_CROWN);
  }
  if (grandTotal >= 10) {
    badges.push(BadgeType.PERFECT_TEN);
  }
  if (grandTotal >= 5) {
    badges.push(BadgeType.HIGH_FIVE);
  }

  console.log('Badge check details:', {
    userId,
    category,
    newCorrectAnswers: correctAnswers,
    categoryTotal,
    grandTotal,
    eligibleBadges: badges
  });

  // Award new badges
  const newBadges = [];
  for (const badgeType of badges) {
    const [badge, created] = await UserBadge.findOrCreate({
      where: {
        userId,
        badgeType
      },
      defaults: {
        earnedAt: new Date()
      }
    });
    if (created) {
      newBadges.push(badge);
    }
  }

  return newBadges;
};

export const getUserBadges = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const badges = await UserBadge.findAll({
      where: { userId },
      order: [['earnedAt', 'DESC']]
    });
    
    res.status(200).json(badges);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ 
      error: 'Failed to fetch badges',
      details: errorMessage
    });
  }
};