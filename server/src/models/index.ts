import dotenv from 'dotenv';
import { User } from './user';
import { TestAttempt } from './testAttempt';


dotenv.config();


// TODO: Create sequelize connection

const sequelize = '';


// TODO: Create a One-to-Many relationship (Volunteer can have numerous volunteer works)

export { sequelize, User };


export { TestAttempt } from './testAttempt';
