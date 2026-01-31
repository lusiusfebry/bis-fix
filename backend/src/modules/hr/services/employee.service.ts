import Employee, { EmployeeCreationAttributes } from '../models/Employee';
import EmployeePersonalInfo, { EmployeePersonalInfoAttributes } from '../models/EmployeePersonalInfo';
import Divisi from '../models/Divisi';
import Department from '../models/Department';
import PosisiJabatan from '../models/PosisiJabatan';
import StatusKaryawan from '../models/StatusKaryawan';
import LokasiKerja from '../models/LokasiKerja';
import Tag from '../models/Tag';
import { Sequelize, Op } from 'sequelize';
import sequelize from '../../../config/database'; // Import sequelize instance
import EmployeeFamilyInfo from '../models/EmployeeFamilyInfo'; // Assuming we need this for full details

class EmployeeService {
    async getAllEmployees(params: any = {}) {
        const { search, divisi_id, department_id, status_id, page = 1, limit = 10 } = params;
        const offset = (page - 1) * limit;

        const where: any = {};

        // Search functionality
        if (search) {
            where[Op.or] = [
                { nama_lengkap: { [Op.iLike]: `%${search}%` } }, // Postgres use iLike for case insensitive
                { nomor_induk_karyawan: { [Op.iLike]: `%${search}%` } }
            ];
        }

        // Filters
        if (divisi_id) where.divisi_id = divisi_id;
        if (department_id) where.department_id = department_id;
        if (status_id) where.status_karyawan_id = status_id;

        const { count, rows } = await Employee.findAndCountAll({
            where,
            include: [
                { model: Divisi, as: 'divisi' },
                { model: Department, as: 'department' },
                { model: PosisiJabatan, as: 'posisi_jabatan' },
                { model: StatusKaryawan, as: 'status_karyawan' },
                { model: LokasiKerja, as: 'lokasi_kerja' },
            ],
            offset,
            limit: parseInt(limit),
            order: [['createdAt', 'DESC']]
        });

        return {
            data: rows,
            total: count,
            page: parseInt(page),
            totalPages: Math.ceil(count / limit)
        };
    }

    async getEmployeeById(id: number) {
        return await Employee.findByPk(id, {
            include: [
                { model: Divisi, as: 'divisi' },
                { model: Department, as: 'department' },
                { model: PosisiJabatan, as: 'posisi_jabatan' },
                { model: StatusKaryawan, as: 'status_karyawan' },
                { model: LokasiKerja, as: 'lokasi_kerja' },
                { model: Tag, as: 'tag' },
                { model: Employee, as: 'manager' }, // Self join
                { model: Employee, as: 'atasan_langsung' }, // Self join
                { model: EmployeePersonalInfo, as: 'personal_info' }
            ]
        });
    }

    async getEmployeeWithDetails(id: number) {
        return this.getEmployeeById(id);
    }

    async createEmployee(data: EmployeeCreationAttributes) {
        return await Employee.create(data);
    }

    async createEmployeeWithPersonalInfo(employeeData: EmployeeCreationAttributes, personalInfoData: any, photoPath?: string) {
        const t = await sequelize.transaction();
        try {
            if (photoPath) {
                employeeData.foto_karyawan = photoPath;
            }

            const employee = await Employee.create(employeeData, { transaction: t });

            if (personalInfoData) {
                await EmployeePersonalInfo.create({
                    ...personalInfoData,
                    employee_id: employee.id
                }, { transaction: t });
            }

            await t.commit();
            return await this.getEmployeeById(employee.id);
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async updateEmployee(id: number, data: Partial<Employee>) {
        const employee = await Employee.findByPk(id);
        if (!employee) throw new Error('Employee not found');
        return await employee.update(data);
    }

    async updateEmployeeWithPersonalInfo(id: number, employeeData: Partial<Employee>, personalInfoData: any, photoPath?: string) {
        const t = await sequelize.transaction();
        try {
            const employee = await Employee.findByPk(id);
            if (!employee) throw new Error('Employee not found');

            if (photoPath) {
                employeeData.foto_karyawan = photoPath;
            }

            await employee.update(employeeData, { transaction: t });

            if (personalInfoData) {
                // Upsert personal info
                const existingPersonalInfo = await EmployeePersonalInfo.findOne({ where: { employee_id: id } });
                if (existingPersonalInfo) {
                    await existingPersonalInfo.update(personalInfoData, { transaction: t });
                } else {
                    await EmployeePersonalInfo.create({
                        ...personalInfoData,
                        employee_id: id
                    }, { transaction: t });
                }
            }

            await t.commit();
            return await this.getEmployeeById(id);
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async deleteEmployee(id: number) {
        const t = await sequelize.transaction();
        try {
            const employee = await Employee.findByPk(id);
            if (!employee) throw new Error('Employee not found');

            // Personal info should cascade delete if configured in DB, but safe to delete here if needed.
            // Assuming DB constraints handle cascade or we let Sequelize handle it via hooks if set up.
            // For now, consistent with existing method.
            await employee.destroy({ transaction: t });

            await t.commit();
            return true;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async validateNIKUnique(nik: string, excludeId?: number) {
        const where: any = { nomor_induk_karyawan: nik };
        if (excludeId) {
            where.id = { [Op.ne]: excludeId };
        }
        const existing = await Employee.findOne({ where });
        return existing === null;
    }
}

export default new EmployeeService();
