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
import EmployeeHRInfo from '../models/EmployeeHRInfo';
import JenisHubunganKerja from '../models/JenisHubunganKerja';
import KategoriPangkat from '../models/KategoriPangkat';
import Golongan from '../models/Golongan';
import SubGolongan from '../models/SubGolongan';
import { qrcodeService } from './qrcode.service';

class EmployeeService {
    async getEmployeeQRCode(id: number) {
        const employee = await Employee.findByPk(id);
        if (!employee) throw new Error('EMPLOYEE_NOT_FOUND');

        const nik = employee.nomor_induk_karyawan;
        if (!nik) throw new Error('NIK_MISSING');

        const qrData = await qrcodeService.generateQRCode(nik);

        return {
            employee: {
                id: employee.id,
                nama: employee.nama_lengkap,
                nik: employee.nomor_induk_karyawan
            },
            ...qrData
        };
    }

    async getEmployeeQRCodeBuffer(id: number): Promise<{ buffer: Buffer, filename: string }> {
        const employee = await Employee.findByPk(id);
        if (!employee) throw new Error('EMPLOYEE_NOT_FOUND');

        const nik = employee.nomor_induk_karyawan;
        if (!nik) throw new Error('NIK_MISSING');

        const buffer = await qrcodeService.generateQRCodeBuffer(nik);
        return {
            buffer,
            filename: `qr-${nik}.png`
        };
    }

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
                { model: EmployeePersonalInfo, as: 'personal_info' },
                {
                    model: EmployeeHRInfo,
                    as: 'hr_info',
                    include: [
                        { model: JenisHubunganKerja, as: 'jenis_hubungan_kerja' },
                        { model: KategoriPangkat, as: 'kategori_pangkat' },
                        { model: Golongan, as: 'golongan' },
                        { model: SubGolongan, as: 'sub_golongan' },
                        { model: LokasiKerja, as: 'lokasi_sebelumnya' }
                    ]
                },
                { model: EmployeeFamilyInfo, as: 'family_info' }
            ]
        });
    }

    async getEmployeeWithDetails(id: number) {
        return this.getEmployeeById(id);
    }

    async createEmployee(data: EmployeeCreationAttributes) {
        return await Employee.create(data);
    }

    async createEmployeeComplete(employeeData: EmployeeCreationAttributes, personalInfoData: any, hrInfoData: any, familyInfoData: any, photoPath?: string, options?: { transaction?: any }) {
        const t = options?.transaction || await sequelize.transaction();
        const isExternalTransaction = !!options?.transaction;

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

            if (hrInfoData) {
                await EmployeeHRInfo.create({
                    ...hrInfoData,
                    employee_id: employee.id
                }, { transaction: t });
            }

            if (familyInfoData) {
                // Parse if string (from FormData)
                if (typeof familyInfoData.data_anak === 'string') familyInfoData.data_anak = JSON.parse(familyInfoData.data_anak);
                if (typeof familyInfoData.data_saudara_kandung === 'string') familyInfoData.data_saudara_kandung = JSON.parse(familyInfoData.data_saudara_kandung);

                await EmployeeFamilyInfo.create({
                    ...familyInfoData,
                    employee_id: employee.id
                }, { transaction: t });
            }

            if (!isExternalTransaction) await t.commit();

            // If external transaction, we can't return the fully fetched object safely if we plan to rely on it immediately committed? 
            // Actually findByPk inside transaction works fine.
            return await this.getEmployeeById(employee.id); // This might need transaction pass-through if getEmployeeById uses read-committed etc, but usually findByPk is simple. 
            // Better to simple return employee.id or basic object if inside transaction to avoid locking issues? 
            // For now, assume getEmployeeById is fine or we skip it if speed is concern.
        } catch (error) {
            if (!isExternalTransaction) await t.rollback();
            throw error;
        }
    }

    async updateEmployee(id: number, data: Partial<Employee>) {
        const employee = await Employee.findByPk(id);
        if (!employee) throw new Error('Employee not found');
        return await employee.update(data);
    }

    async updateEmployeeComplete(id: number, employeeData: Partial<Employee>, personalInfoData: any, hrInfoData: any, familyInfoData: any, photoPath?: string) {
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

            if (familyInfoData) {
                // Parse if string (from FormData)
                if (typeof familyInfoData.data_anak === 'string') familyInfoData.data_anak = JSON.parse(familyInfoData.data_anak);
                if (typeof familyInfoData.data_saudara_kandung === 'string') familyInfoData.data_saudara_kandung = JSON.parse(familyInfoData.data_saudara_kandung);

                // Upsert family info
                const existingFamilyInfo = await EmployeeFamilyInfo.findOne({ where: { employee_id: id } });
                if (existingFamilyInfo) {
                    await existingFamilyInfo.update(familyInfoData, { transaction: t });
                } else {
                    await EmployeeFamilyInfo.create({
                        ...familyInfoData,
                        employee_id: id
                    }, { transaction: t });
                }
            }

            if (hrInfoData) {
                // Upsert hr info
                const existingHRInfo = await EmployeeHRInfo.findOne({ where: { employee_id: id } });
                if (existingHRInfo) {
                    await existingHRInfo.update(hrInfoData, { transaction: t });
                } else {
                    await EmployeeHRInfo.create({
                        ...hrInfoData,
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
