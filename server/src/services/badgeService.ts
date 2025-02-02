// services/badgeService.ts
import { TestAttempt } from '../models/testAttempt';
import { UserBadge, BadgeType, BADGE_CRITERIA } from '../models/badge';
import { sequelize } from '../config/database';

export class BadgeService {
  static async checkAndAwardBadges(userId: string): Promise<UserBadge[]> {
    const earnedBadges: UserBadge[] = [];

    // Get user's test attempts
    const attempts = await TestAttempt.findAll({
      where: { userId },
      attributes: ['category', 'correctAnswers']
    });

    // Calculate total correct answers per category
    const correctAnswersByCategory: Record<string, number> = {};
    const totalCorrectAnswers = attempts.reduce((total, attempt) => {
      const category = attempt.category;
      correctAnswersByCategory[category] = (correctAnswersByCategory[category] || 0) + attempt.correctAnswers;
      return total + attempt.correctAnswers;
    }, 0);

    // Get existing badges
    const existingBadges = await UserBadge.findAll({
      where: { userId }
    });

    // Check each badge criteria
    for (const criteria of BADGE_CRITERIA) {
      const hasExistingBadge = existingBadges.some(badge => badge.badgeType === criteria.type);
      if (hasExistingBadge) continue;

      const { requirement } = criteria;
      let qualifies = false;

      if (requirement.category) {
        // Category-specific badge
        qualifies = (correctAnswersByCategory[requirement.category] || 0) >= requirement.correctAnswers;
      } else {
        // Total answers badge
        qualifies = totalCorrectAnswers >= requirement.correctAnswers;
      }

      if (qualifies) {
        const newBadge = await UserBadge.create({
          userId,
          badgeType: criteria.type,
          earnedAt: new Date()
        });
        earnedBadges.push(newBadge);
      }
    }

    return earnedBadges;
  }

  static async getUserBadges(userId: string): Promise<UserBadge[]> {
    return UserBadge.findAll({
      where: { userId },
      order: [['earnedAt', 'DESC']]
    });
  }
}