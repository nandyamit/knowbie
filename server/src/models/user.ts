import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import bcrypt from 'bcrypt';

// Interface for the attributes that are required to create a User
interface UserAttributes {
  id: string;
  username: string;
  email: string;
  password: string;
}

// Interface for User creation (allows some attributes to be optional during creation)
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

// Extend Model with the attributes
export class User extends Model<UserAttributes, UserCreationAttributes> {
  public id!: string;
  public username!: string;
  public email!: string;
  public password!: string;

  // Optional: Add timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Optional: Add methods
  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

// Initialize the model
User.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'User',

});