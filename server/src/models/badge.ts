// Badge model

import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './user';

export class Badge extends Model {
  public id!: string;
  public userId!: string;
  public badgeType!: string;
  public earnedAt!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getImageUrl(): string {
    return `/Assets/${this.badgeType}.png`; 
  }
}

Badge.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    badgeType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    earnedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Badge',
    tableName: 'badges',
    timestamps: true,
  }
);
