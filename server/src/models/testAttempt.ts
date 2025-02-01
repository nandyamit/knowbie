// models/testAttempt.ts
import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/sequelize';
import { User } from './user';

interface TestAttemptAttributes {
  id: string;
  userId: string;
  category: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  dateTaken: Date;
}

interface TestAttemptCreationAttributes extends Optional<TestAttemptAttributes, 'id'> {}

export class TestAttempt extends Model<TestAttemptAttributes, TestAttemptCreationAttributes> {
  public id!: string;
  public userId!: string;
  public category!: string;
  public score!: number;
  public totalQuestions!: number;
  public correctAnswers!: number;
  public wrongAnswers!: number;
  public dateTaken!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

TestAttempt.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users', // This should match your User table name
      key: 'id'
    }
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  totalQuestions: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  correctAnswers: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  wrongAnswers: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  dateTaken: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'TestAttempt',
  tableName: 'test_attempts',
  timestamps: true
});