import Employee from '../models/Employee';
import Department from '../models/Department';
import Divisi from '../models/Divisi';
import StatusKaryawan from '../models/StatusKaryawan';
import Leave from '../models/Leave';
import Attendance from '../models/Attendance';
import { Sequelize, Op } from 'sequelize';

class DashboardService {
    async getDashboardStats() {
        // Total Active Employees
        const totalEmployees = await Employee.count({
            include: [{
                model: StatusKaryawan,
                as: 'status_karyawan',
                where: { status: 'Aktif' }
            }]
        });

        // Total Active Departments
        const totalDepartments = await Department.count();

        // Employees on Leave (Active Approved Leave today)
        const employeesOnLeave = await Leave.count({
            where: {
                status: 'Approved',
                tanggal_mulai: { [Op.lte]: new Date() },
                tanggal_selesai: { [Op.gte]: new Date() }
            }
        });

        // Attendance Rate (Present today / Total Active Employees)
        const presentCount = await Attendance.count({
            where: {
                tanggal: new Date(),
                status: 'Hadir'
            }
        });

        const attendanceRate = totalEmployees > 0
            ? Math.round((presentCount / totalEmployees) * 100)
            : 0;

        return {
            totalEmployees,
            totalDepartments,
            employeesOnLeave,
            attendanceRate
        };
    }

    async getEmployeeDistribution() {
        const distribution = await Employee.findAll({
            attributes: [
                [Sequelize.col('department.nama'), 'department_name'],
                [Sequelize.col('divisi.nama'), 'divisi_name'],
                [Sequelize.fn('COUNT', Sequelize.col('Employee.id')), 'employee_count']
            ],
            include: [
                { model: Department, as: 'department', attributes: [] },
                { model: Divisi, as: 'divisi', attributes: [] }
            ],
            group: ['department.id', 'divisi.id', 'department.nama', 'divisi.nama'],
            raw: true
        });

        return distribution;
    }

    async getRecentActivities() {
        const recentEmployees = await Employee.findAll({
            limit: 10,
            order: [['createdAt', 'DESC']],
            include: [
                { model: Department, as: 'department', attributes: ['nama'] },
                { model: StatusKaryawan, as: 'status_karyawan', attributes: ['nama'] }
            ],
            attributes: ['id', 'nama_lengkap', 'foto_karyawan', 'createdAt']
        });

        return recentEmployees.map((e: any) => ({
            nama_lengkap: e.nama_lengkap,
            foto_karyawan: e.foto_karyawan,
            department_name: e.department?.nama,
            status: e.status_karyawan?.nama,
            createdAt: e.createdAt
        }));
    }

    async getEmploymentStatusDistribution() {
        const distribution = await Employee.findAll({
            attributes: [
                [Sequelize.col('status_karyawan.nama'), 'status_name'],
                [Sequelize.fn('COUNT', Sequelize.col('Employee.id')), 'count']
            ],
            include: [
                { model: StatusKaryawan, as: 'status_karyawan', attributes: [] }
            ],
            group: ['status_karyawan.id', 'status_karyawan.nama'],
            raw: true
        });

        let tetapCount = 0;
        let kontrakCount = 0;
        let total = 0;

        (distribution as any[]).forEach(d => {
            const count = parseInt(d.count);
            total += count;
            if (d.status_name === 'Tetap' || d.status_name === 'PKWTT') tetapCount += count;
            else kontrakCount += count;
        });

        return {
            tetap_count: tetapCount,
            kontrak_count: kontrakCount,
            tetap_percentage: total > 0 ? Math.round((tetapCount / total) * 100) : 0,
            details: distribution
        };
    }
}

export default new DashboardService();
