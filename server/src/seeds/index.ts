// seeds/index.ts
import { seedUsers } from './user-seeds';
import { seedTestAttempts } from './test-attempts-seeds';
import { seedBadges } from './badge-seeds';
import { sequelize } from '../config/database';

const seedAll = async () => {
    try {
        // Force sync in development only
        if (process.env.NODE_ENV !== 'production') {
            await sequelize.sync({ force: true });
            console.log('\nDatabase synced');
        }

        // Seed in order of dependencies
        await seedUsers();
        console.log('\nUsers seeded ✓');
        
        await seedTestAttempts();
        console.log('\nTest attempts seeded ✓');
        
        await seedBadges();
        console.log('\nBadges seeded ✓');

        console.log('\nAll seed data inserted successfully! 🎉\n');
        process.exit(0);
    } catch (error) {
        console.error('\nError seeding data:', error);
        process.exit(1);
    }
};

seedAll();