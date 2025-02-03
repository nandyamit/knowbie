// seeds/user-seeds.ts
import { User } from "../models/user";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

export const seedUsers = async (): Promise<void> => {
    try {
        // Hash passwords before creating users
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash('password', saltRounds);

        await User.bulkCreate(
            [
                {   
                    id: uuidv4(),
                    username: "johndoe",
                    email: "johndoe@example.com",
                    password: hashedPassword,
                },
                {
                    id: uuidv4(),
                    username: "janedoe",
                    email: "janedoe@example.com",
                    password: hashedPassword,
                },
            ],
            { 
                individualHooks: false // Set to false since we're manually hashing
            }
        );
        console.log('Users seeded successfully with hashed passwords');
    } catch (error: any) {
        console.error("Error seeding users:", error);
    }
};