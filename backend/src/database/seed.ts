import sequelize from '../config/database';
import Employee from '../modules/hr/models/Employee';

const seed = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected...');

        const count = await Employee.count();
        if (count === 0) {
            await Employee.bulkCreate([
                {
                    nik: '123456',
                    name: 'Admin User',
                    email: 'admin@bebang.com',
                    position: 'Administrator',
                    department: 'IT',
                    joinDate: new Date(),
                    phone: '081234567890'
                },
                {
                    nik: '654321',
                    name: 'HR Staff',
                    email: 'hr@bebang.com',
                    position: 'HR Staff',
                    department: 'HR',
                    joinDate: new Date(),
                    phone: '080987654321'
                }
            ]);
            console.log('Initial data seeded successfully.');
        } else {
            console.log('Data already exists, skipping seed.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seed();
