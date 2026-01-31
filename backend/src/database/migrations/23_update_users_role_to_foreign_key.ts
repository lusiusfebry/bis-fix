import { QueryInterface, DataTypes, Op } from 'sequelize';

export default {
    up: async (queryInterface: QueryInterface) => {
        // 1. Add role_id column (initially nullable)
        await queryInterface.addColumn('users', 'role_id', {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'roles',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        });

        // 2. Data Migration: Map existing ENUM roles to Roles table
        // We assume the roles will be seeded properly before this logic effectively runs 
        // BUT since migrations run in order, seed usually runs after. 
        // So we should execute raw SQL to insert roles if strictly needed or assume 
        // we run seed separately. 
        // BETTER APPROACH: Insert temporary roles here to map, then rely on seed to update/fix them.
        // OR: Just leave it nullable, and have a separate seed script that populates roles and updates users.
        // However, migration usually handles schema.

        // Let's Insert basic roles to ensure mapping works
        const roles = [
            { name: 'superadmin', display_name: 'Super Administrator', is_system_role: true },
            { name: 'admin', display_name: 'HR Admin', is_system_role: true },
            { name: 'staff', display_name: 'HR Staff', is_system_role: true },
            { name: 'employee', display_name: 'Employee', is_system_role: true },
            // 'manager' wasn't in original enum list from context, but plan mentioned 'manager' role.
            // If original enum had 'manager', add it. Assuming it did or we map 'staff' to it?
            // Original User model had: enum: superadmin, admin, staff, employee.
        ];

        const now = new Date();
        // Use bulkInsert for roles
        await queryInterface.bulkInsert('roles', roles.map(r => ({
            ...r,
            created_at: now,
            updated_at: now
        })));

        // 3. Update users role_id based on role enum
        // We can use raw query for this update
        await queryInterface.sequelize.query(`
      UPDATE users u
      JOIN roles r ON u.role = r.name
      SET u.role_id = r.id;
    `);

        // 4. Drop old role column
        await queryInterface.removeColumn('users', 'role');
    },

    down: async (queryInterface: QueryInterface) => {
        // 1. Add role column back
        await queryInterface.addColumn('users', 'role', {
            type: DataTypes.ENUM('superadmin', 'admin', 'staff', 'employee'),
            allowNull: false,
            defaultValue: 'employee'
        });

        // 2. Data Migration: Map role_id back to name
        await queryInterface.sequelize.query(`
      UPDATE users u
      JOIN roles r ON u.role_id = r.id
      SET u.role = r.name;
    `);

        // 3. Drop role_id column
        await queryInterface.removeColumn('users', 'role_id');

        // Note: We don't delete roles from roles table in down migration usually to preserve data safety, 
        // but strict down would empty it. create_rbac_tables down handles dropping the table.
    }
};
