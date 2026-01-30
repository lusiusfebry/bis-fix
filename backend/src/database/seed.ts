import sequelize from '../config/database';
import Employee from '../modules/hr/models/Employee';
import User from '../modules/auth/models/User';

const seed = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected...');

        // Seed Employees
        const employeeCount = await Employee.count();
        let employees;

        if (employeeCount === 0) {
            console.log('Seeding employees...');
            employees = await Employee.bulkCreate([
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
                },
                {
                    nik: '111111',
                    name: 'Regular Staff',
                    email: 'staff@bebang.com',
                    position: 'Staff',
                    department: 'General',
                    joinDate: new Date(),
                    phone: '081111111111'
                }
            ]);
            console.log('Employees seeded.');
        } else {
            console.log('Employees already exist, fetching...');
            employees = await Employee.findAll();
        }

        // Seed Users
        const userCount = await User.count();
        if (userCount === 0) {
            console.log('Seeding users...');

            const adminEmployee = employees.find(e => e.nik === '123456');
            const hrEmployee = employees.find(e => e.nik === '654321');
            const staffEmployee = employees.find(e => e.nik === '111111');

            await User.bulkCreate([
                {
                    nik: '123456',
                    password: 'password123', // Will be hashed by hook
                    role: 'superadmin',
                    employee_id: adminEmployee?.id || null,
                    is_active: true
                },
                {
                    nik: '654321',
                    password: 'password123',
                    role: 'admin',
                    employee_id: hrEmployee?.id || null,
                    is_active: true
                },
                {
                    nik: '111111',
                    password: 'password123',
                    role: 'staff',
                    employee_id: staffEmployee?.id || null,
                    is_active: true
                }
            ], { individualHooks: true }); // Important for password hashing

            console.log('Users seeded.');
        } else {
            console.log('Users already exist, skipping.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seed();
