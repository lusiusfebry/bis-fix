import { DataTypes, Model } from 'sequelize';
import sequelize from '../../../config/database';

export class LokasiKerja extends Model {
    public id!: number;
    public nama!: string;
    public alamat!: string | null;
    public keterangan!: string | null;
    public status!: 'Aktif' | 'Tidak Aktif';

    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

LokasiKerja.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nama: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Nama lokasi kerja tidak boleh kosong' },
        },
    },
    alamat: {
        type: DataTypes.TEXT,
        allowNull: true,
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
    tableName: 'lokasi_kerja',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

export default LokasiKerja;
