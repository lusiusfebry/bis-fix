import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../../config/database';
import Employee from './Employee';

// Interfaces for JSONB data
export interface DataAnak {
    nama: string;
    jenis_kelamin: 'Laki-laki' | 'Perempuan';
    tanggal_lahir: string; // Date string
    keterangan?: string;
}

export interface DataSaudaraKandung {
    nama: string;
    jenis_kelamin: 'Laki-laki' | 'Perempuan';
    tanggal_lahir: string; // Date string
    pendidikan_terakhir?: string;
    pekerjaan?: string;
    keterangan?: string;
}

export interface EmployeeFamilyInfoAttributes {
    id: number;
    employee_id: number;
    // Pasangan
    tanggal_lahir_pasangan?: string;
    pendidikan_terakhir_pasangan?: string;
    keterangan_pasangan?: string;
    // Saudara Kandung
    anak_ke?: number;
    jumlah_saudara_kandung?: number;
    // Orang Tua Mertua (Ayah)
    nama_ayah_mertua?: string;
    tanggal_lahir_ayah_mertua?: string;
    pendidikan_terakhir_ayah_mertua?: string;
    keterangan_ayah_mertua?: string;
    // Orang Tua Mertua (Ibu)
    nama_ibu_mertua?: string;
    tanggal_lahir_ibu_mertua?: string;
    pendidikan_terakhir_ibu_mertua?: string;
    keterangan_ibu_mertua?: string;
    // Repeatable Fields
    data_anak?: DataAnak[];
    data_saudara_kandung?: DataSaudaraKandung[];

    created_at?: Date;
    updated_at?: Date;

    // Associations
    employee?: Employee;
}

export interface EmployeeFamilyInfoCreationAttributes extends Optional<EmployeeFamilyInfoAttributes, 'id' | 'created_at' | 'updated_at'> { }

export class EmployeeFamilyInfo extends Model<EmployeeFamilyInfoAttributes, EmployeeFamilyInfoCreationAttributes> implements EmployeeFamilyInfoAttributes {
    public id!: number;
    public employee_id!: number;
    public tanggal_lahir_pasangan?: string;
    public pendidikan_terakhir_pasangan?: string;
    public keterangan_pasangan?: string;
    public anak_ke?: number;
    public jumlah_saudara_kandung?: number;
    public nama_ayah_mertua?: string;
    public tanggal_lahir_ayah_mertua?: string;
    public pendidikan_terakhir_ayah_mertua?: string;
    public keterangan_ayah_mertua?: string;
    public nama_ibu_mertua?: string;
    public tanggal_lahir_ibu_mertua?: string;
    public pendidikan_terakhir_ibu_mertua?: string;
    public keterangan_ibu_mertua?: string;
    public data_anak?: DataAnak[];
    public data_saudara_kandung?: DataSaudaraKandung[];

    public readonly created_at!: Date;
    public readonly updated_at!: Date;

    public readonly employee?: Employee;

    // Helpers
    public addAnak(anak: DataAnak) {
        const currentAnak = this.data_anak || [];
        this.data_anak = [...currentAnak, anak];
    }

    public removeAnak(index: number) {
        const currentAnak = this.data_anak || [];
        if (index >= 0 && index < currentAnak.length) {
            this.data_anak = currentAnak.filter((_, i) => i !== index);
        }
    }

    public addSaudaraKandung(saudara: DataSaudaraKandung) {
        const currentSaudara = this.data_saudara_kandung || [];
        if (currentSaudara.length >= 5) {
            throw new Error('Maksimal jumlah saudara kandung adalah 5');
        }
        this.data_saudara_kandung = [...currentSaudara, saudara];
    }

    public removeSaudaraKandung(index: number) {
        const currentSaudara = this.data_saudara_kandung || [];
        if (index >= 0 && index < currentSaudara.length) {
            this.data_saudara_kandung = currentSaudara.filter((_, i) => i !== index);
        }
    }
}

EmployeeFamilyInfo.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    employee_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
            model: 'employees',
            key: 'id'
        }
    },
    tanggal_lahir_pasangan: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    pendidikan_terakhir_pasangan: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    keterangan_pasangan: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    anak_ke: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    jumlah_saudara_kandung: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    nama_ayah_mertua: {
        type: DataTypes.STRING(200),
        allowNull: true,
    },
    tanggal_lahir_ayah_mertua: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    pendidikan_terakhir_ayah_mertua: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    keterangan_ayah_mertua: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    nama_ibu_mertua: {
        type: DataTypes.STRING(200),
        allowNull: true,
    },
    tanggal_lahir_ibu_mertua: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    pendidikan_terakhir_ibu_mertua: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    keterangan_ibu_mertua: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    data_anak: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: [],
    },
    data_saudara_kandung: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: [],
        validate: {
            checkLimit(value: any[]) {
                if (value && value.length > 5) {
                    throw new Error('Maksimal data saudara kandung hanya boleh 5');
                }
            }
        }
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    tableName: 'employee_family_info',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

export default EmployeeFamilyInfo;
