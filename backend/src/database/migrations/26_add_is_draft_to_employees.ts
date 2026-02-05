import { QueryInterface, DataTypes } from 'sequelize';

export default {
    up: async (queryInterface: QueryInterface) => {
        // Add is_draft column to employees table
        await queryInterface.addColumn('employees', 'is_draft', {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        });

        // Add index for faster draft queries
        await queryInterface.addIndex('employees', ['is_draft'], {
            name: 'idx_employees_is_draft',
        });
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.removeIndex('employees', 'idx_employees_is_draft');
        await queryInterface.removeColumn('employees', 'is_draft');
    },
};
