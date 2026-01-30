import { DataTypes, Model } from 'sequelize';
import sequelize from '../../../config/database';

export class JenisHubunganKerja extends Model {
    public id!: number;
    public nama!: string;
    public keterangan!: string | null;
    public status!: 'Aktif' | 'Tidak Aktif';

    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

JenisHubunganKerja.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nama: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Nama jenis hubungan kerja tidak boleh kosong' },
        },
    },
    keterangan: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('Aktif', 'Tidak Aktif'),
        allowNull: false,
        defaultValue: 'Aktif',
    },
}, {
    sequelize,
    tableName: 'jenis_hubungan_kerja',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

export default JenisHubunganKerja;
