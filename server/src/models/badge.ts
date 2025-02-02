// Badge model
// models/badge.ts
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './user';

// Badge types enum
export enum BadgeType {
  HIGH_FIVE = 'High Five!',
  PERFECT_TEN = 'Perfect Ten',
  TRIPLE_CROWN = 'Triple Crown',
  SCENE_STEALER = 'Scene Stealer',
  BOOKWORM_ELITE = 'Bookworm Elite',
  RHYTHM_MASTER = 'Rhythm Master'
}

// Badge criteria interface
export interface BadgeCriteria {
  type: BadgeType;
  description: string;
  requirement: {
    correctAnswers: number;
    category?: string;
  };
}

// Badge definitions
export const BADGE_CRITERIA: BadgeCriteria[] = [
  {
    type: BadgeType.HIGH_FIVE,
    description: 'Complete 5 correct answers',
    requirement: { correctAnswers: 5 }
  },
  {
    type: BadgeType.PERFECT_TEN,
    description: 'Complete 10 correct answers',
    requirement: { correctAnswers: 10 }
  },
  {
    type: BadgeType.TRIPLE_CROWN,
    description: 'Complete 15 correct answers',
    requirement: { correctAnswers: 15 }
  },
  {
    type: BadgeType.SCENE_STEALER,
    description: 'Complete 5 correct answers in movie category',
    requirement: { correctAnswers: 5, category: 'Film' }
  },
  {
    type: BadgeType.BOOKWORM_ELITE,
    description: 'Complete 5 correct answers in books category',
    requirement: { correctAnswers: 5, category: 'Books' }
  },
  {
    type: BadgeType.RHYTHM_MASTER,
    description: 'Complete 5 correct answers in music category',
    requirement: { correctAnswers: 5, category: 'Music' }
  }
];

// User badges model
export class UserBadge extends Model {
  public id!: string;
  public userId!: string;
  public badgeType!: BadgeType;
  public earnedAt!: Date;
}

UserBadge.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  badgeType: {
    type: DataTypes.ENUM(...Object.values(BadgeType)),
    allowNull: false
  },
  earnedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'UserBadge',
  tableName: 'user_badges',
  timestamps: true
});