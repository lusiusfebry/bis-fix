
import { QueryInterface } from 'sequelize';

module.exports = {
    up: async (queryInterface: QueryInterface) => {
        // Adding indexes for frequently searched/filtered columns
        await queryInterface.addIndex('employees', ['nama_lengkap']);
        await queryInterface.addIndex('employees', ['nomor_induk_karyawan']);
        await queryInterface.addIndex('employees', ['divisi_id']);
        await queryInterface.addIndex('employees', ['department_id']);
        await queryInterface.addIndex('employees', ['posisi_jabatan_id']);
        await queryInterface.addIndex('employees', ['status_karyawan_id']);
        await queryInterface.addIndex('employees', ['lokasi_kerja_id']);
        await queryInterface.addIndex('employees', ['tag_id']);

        // Composite index for common filter combination might be overkill for now given dataset size,
        // individual indexes should suffice for most DB optimizers.

        // NIK should already be unique indexed if it was defined as unique.
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.removeIndex('employees', ['nama_lengkap']);
        await queryInterface.removeIndex('employees', ['nomor_induk_karyawan']);
        await queryInterface.removeIndex('employees', ['divisi_id']);
        await queryInterface.removeIndex('employees', ['department_id']);
        await queryInterface.removeIndex('employees', ['posisi_jabatan_id']);
        await queryInterface.removeIndex('employees', ['status_karyawan_id']);
        await queryInterface.removeIndex('employees', ['lokasi_kerja_id']);
        await queryInterface.removeIndex('employees', ['tag_id']);
    }
};
