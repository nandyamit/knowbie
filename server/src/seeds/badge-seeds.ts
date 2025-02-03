// seeds/badge-seeds.ts
import { UserBadge, BadgeType } from "../models/badge";
import { User } from "../models/user";
import { v4 as uuidv4 } from 'uuid';

export const seedBadges = async (): Promise<void> => {
  try {
    // Get the seeded users
    const users = await User.findAll();
    
    for (const user of users) {
      // Seed badges that would have been earned based on test attempts
      await UserBadge.bulkCreate([
        {
          id: uuidv4(),
          userId: user.id,
          badgeType: BadgeType.HIGH_FIVE,
          earnedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
        },
        {
          id: uuidv4(),
          userId: user.id,
          badgeType: BadgeType.PERFECT_TEN,
          earnedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        },
        {
          id: uuidv4(),
          userId: user.id,
          badgeType: BadgeType.TRIPLE_CROWN,
          earnedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
        },
        {
          id: uuidv4(),
          userId: user.id,
          badgeType: BadgeType.SCENE_STEALER,
          earnedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        },
        {
          id: uuidv4(),
          userId: user.id,
          badgeType: BadgeType.BOOKWORM_ELITE,
          earnedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        },
        {
          id: uuidv4(),
          userId: user.id,
          badgeType: BadgeType.RHYTHM_MASTER,
          earnedAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      ]);
    }

    console.log('Badges seeded successfully');
  } catch (error: any) {
    console.error('Error seeding badges:', error);
  }
};