import dotenv from 'dotenv';
import { User } from './user';
import { TestAttempt } from './testAttempt';
import { Badge } from './badge';


dotenv.config();


// TODO: Create sequelize connection

const sequelize = '';


// TODO: Create a One-to-Many relationship (Volunteer can have numerous volunteer works)

export { sequelize, User, TestAttempt, Badge };

// Amit's code below, commented in favor of trying to simplify and add TestAttempt above on line 17
// export { TestAttempt } from './testAttempt';
