import { QueryInterface, DataTypes } from 'sequelize';
import sequelize from '../../config/database';

export const up = async (queryInterface: QueryInterface): Promise<void> => {
    const qi = sequelize.getQueryInterface();

    await qi.addColumn('employee_family_info', 'nama_ayah_kandung', {
        type: DataTypes.STRING(200),
        allowNull: true,
    });
    await qi.addColumn('employee_family_info', 'nama_ibu_kandung', {
        type: DataTypes.STRING(200),
        allowNull: true,
    });
    await qi.addColumn('employee_family_info', 'alamat_orang_tua', {
        type: DataTypes.TEXT,
        allowNull: true,
    });
};

export const down = async (queryInterface: QueryInterface): Promise<void> => {
    const qi = sequelize.getQueryInterface();
    await qi.removeColumn('employee_family_info', 'nama_ayah_kandung');
    await qi.removeColumn('employee_family_info', 'nama_ibu_kandung');
    await qi.removeColumn('employee_family_info', 'alamat_orang_tua');
};
