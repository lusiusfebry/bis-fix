import Employee from '../models/Employee';
import Department from '../models/Department';
import Divisi from '../models/Divisi';
import StatusKaryawan from '../models/StatusKaryawan';
import { Sequelize } from 'sequelize';

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

        return {
            totalEmployees,
            totalDepartments,
            // TODO: Implement real queries when 'leaves' (Cuti/Izin) table is created.
            // Example:
            // employeesOnLeave: await Leave.count({ where: { status: 'Approved', date: today } }),
            employeesOnLeave: 0,

            // TODO: Implement real queries when 'attendance' (Absensi) table is created.
            // Example:
            // const present = await Attendance.count({ where: { date: today, status: 'Present' } });
            // attendanceRate: (present / totalEmployees) * 100,
            attendanceRate: 0
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

        // Calculate percentages could be done here or frontend.
        // Let's simple return the counts for now as requested format is simple stats.
        // Plan says: "{ tetap_count, kontrak_count, tetap_percentage }"
        // But dynamic grouping is safer. Queries above return generic distribution.

        let tetapCount = 0;
        let kontrakCount = 0;
        let total = 0;

        (distribution as any[]).forEach(d => {
            const count = parseInt(d.count);
            total += count;
            if (d.status_name === 'Tetap' || d.status_name === 'PKWTT') tetapCount += count;
            else kontrakCount += count; // Simplification
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
