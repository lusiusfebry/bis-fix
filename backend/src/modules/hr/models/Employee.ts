import { DataTypes, Model } from 'sequelize';
import sequelize from '../../../config/database';

export class Employee extends Model {
    public id!: number;
    public nik!: string;
    public name!: string;
    public email!: string;
    public phone!: string;
    public position!: string;
    public department!: string;
    public joinDate!: Date;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Employee.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nik: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    position: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    department: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    joinDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
}, {
    sequelize,
    tableName: 'employees',
});

export default Employee;
