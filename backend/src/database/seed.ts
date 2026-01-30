import sequelize from '../config/database';
// import { User } from '../modules/hr/models/User'; // Example import

const seed = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected...');

        // Seed Logic Here
        // example:
        // await User.bulkCreate([
        //   { nik: '123456', password: 'password', name: 'Admin' }
        // ]);

        console.log('Seeding completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seed();
