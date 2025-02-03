// seeds/test-attempts-seeds.ts
import { TestAttempt } from "../models/testAttempt";
import { User } from "../models/user";
import { v4 as uuidv4 } from 'uuid';

export const seedTestAttempts = async (): Promise<void> => {
  try {
    // Get the seeded users
    const users = await User.findAll();

    for (const user of users) {
      if (user.username === 'johndoe') {
        // johndoe's attempts - spread across different days
        await TestAttempt.bulkCreate([
          {
            id: uuidv4(),
            userId: user.id,
            category: 'Film',
            score: 80,
            totalQuestions: 5,
            correctAnswers: 4,
            wrongAnswers: 1,
            dateTaken: new Date('2025-01-25')
          },
          {
            id: uuidv4(),
            userId: user.id,
            category: 'Books',
            score: 60,
            totalQuestions: 5,
            correctAnswers: 3,
            wrongAnswers: 2,
            dateTaken: new Date('2025-01-28')
          },
          {
            id: uuidv4(),
            userId: user.id,
            category: 'Music',
            score: 100,
            totalQuestions: 5,
            correctAnswers: 5,
            wrongAnswers: 0,
            dateTaken: new Date('2025-01-31')
          }
        ]);
      } else if (user.username === 'janedoe') {
        // January 26th attempts - all categories
        await TestAttempt.bulkCreate([
          {
            id: uuidv4(),
            userId: user.id,
            category: 'Film',
            score: 80,
            totalQuestions: 5,
            correctAnswers: 4,
            wrongAnswers: 1,
            dateTaken: new Date('2025-01-26 10:00:00')
          },
          {
            id: uuidv4(),
            userId: user.id,
            category: 'Books',
            score: 100,
            totalQuestions: 5,
            correctAnswers: 5,
            wrongAnswers: 0,
            dateTaken: new Date('2025-01-26 14:00:00')
          },
          {
            id: uuidv4(),
            userId: user.id,
            category: 'Music',
            score: 60,
            totalQuestions: 5,
            correctAnswers: 3,
            wrongAnswers: 2,
            dateTaken: new Date('2025-01-26 18:00:00')
          },
          // January 27th attempts - all categories
          {
            id: uuidv4(),
            userId: user.id,
            category: 'Film',
            score: 100,
            totalQuestions: 5,
            correctAnswers: 5,
            wrongAnswers: 0,
            dateTaken: new Date('2025-01-27 09:00:00')
          },
          {
            id: uuidv4(),
            userId: user.id,
            category: 'Books',
            score: 80,
            totalQuestions: 5,
            correctAnswers: 4,
            wrongAnswers: 1,
            dateTaken: new Date('2025-01-27 13:00:00')
          },
          {
            id: uuidv4(),
            userId: user.id,
            category: 'Music',
            score: 100,
            totalQuestions: 5,
            correctAnswers: 5,
            wrongAnswers: 0,
            dateTaken: new Date('2025-01-27 17:00:00')
          },
          // January 30th attempts - all categories
          {
            id: uuidv4(),
            userId: user.id,
            category: 'Film',
            score: 100,
            totalQuestions: 5,
            correctAnswers: 5,
            wrongAnswers: 0,
            dateTaken: new Date('2025-01-30 11:00:00')
          },
          {
            id: uuidv4(),
            userId: user.id,
            category: 'Books',
            score: 100,
            totalQuestions: 5,
            correctAnswers: 5,
            wrongAnswers: 0,
            dateTaken: new Date('2025-01-30 15:00:00')
          },
          {
            id: uuidv4(),
            userId: user.id,
            category: 'Music',
            score: 100,
            totalQuestions: 5,
            correctAnswers: 5,
            wrongAnswers: 0,
            dateTaken: new Date('2025-01-30 19:00:00')
          }
        ]);
      }
    }
    console.log('Test attempts seeded successfully');
  } catch (error: any) {
    console.error('Error seeding test attempts:', error);
  }
};