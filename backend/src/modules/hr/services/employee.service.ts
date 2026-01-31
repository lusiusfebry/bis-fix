import Employee, { EmployeeCreationAttributes } from '../models/Employee';
import Divisi from '../models/Divisi';
import Department from '../models/Department';
import PosisiJabatan from '../models/PosisiJabatan';
import StatusKaryawan from '../models/StatusKaryawan';
import LokasiKerja from '../models/LokasiKerja';
import { Sequelize, Op } from 'sequelize';

class EmployeeService {
    async getAllEmployees(params: any = {}) {
        const { search, divisi_id, department_id, status_id, page = 1, limit = 10 } = params;
        const offset = (page - 1) * limit;

        const where: any = {};

        // Search functionality
        if (search) {
            where[Op.or] = [
                { nama_lengkap: { [Op.like]: `%${search}%` } },
                { nomor_induk_karyawan: { [Op.like]: `%${search}%` } }
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
                // Tag usually many-to-many, keeping it simple for now or check relation
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
        return await Employee.findByPk(id);
    }

    async createEmployee(data: EmployeeCreationAttributes) {
        return await Employee.create(data);
    }

    async updateEmployee(id: number, data: Partial<Employee>) {
        const employee = await this.getEmployeeById(id);
        if (!employee) throw new Error('Employee not found');
        return await employee.update(data);
    }

    async deleteEmployee(id: number) {
        const employee = await this.getEmployeeById(id);
        if (!employee) throw new Error('Employee not found');
        return await employee.destroy();
    }
}

export default new EmployeeService();
