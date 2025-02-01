// config/database.ts
import { sequelize } from './sequelize';
import { User } from '../models/user';
import { TestAttempt } from '../models/testAttempt';

export const initializeDatabase = async () => {
  try {
    console.log('Testing database connection...');
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    if (process.env.NODE_ENV !== 'production') {
      console.log('Development mode: Dropping test_attempts table...');
      await sequelize.query('DROP TABLE IF EXISTS test_attempts CASCADE');
      console.log('test_attempts table dropped successfully');
    }

    // Define associations
    console.log('Setting up model associations...');
    User.hasMany(TestAttempt, {
      sourceKey: 'id',
      foreignKey: 'userId',
      as: 'testAttempts'
    });
    
    TestAttempt.belongsTo(User, {
      targetKey: 'id',
      foreignKey: 'userId',
      as: 'user'
    });

    // Sync all models
    console.log('Syncing database models...');
    await sequelize.sync();
    console.log('Models synchronized successfully');

    // Verify tables
    const [tables] = await sequelize.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
    );
    console.log('Available tables:', tables);

    // Verify TestAttempt table structure
    const [columns] = await sequelize.query(
      "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'test_attempts'"
    );
    console.log('TestAttempt table columns:', columns);

  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};

export { sequelize };