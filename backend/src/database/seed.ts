import sequelize from '../config/database';
import Employee from '../modules/hr/models/Employee';
import User from '../modules/auth/models/User';
import Divisi from '../modules/hr/models/Divisi';
import Department from '../modules/hr/models/Department';
import PosisiJabatan from '../modules/hr/models/PosisiJabatan';
import KategoriPangkat from '../modules/hr/models/KategoriPangkat';
import Golongan from '../modules/hr/models/Golongan';
import SubGolongan from '../modules/hr/models/SubGolongan';
import JenisHubunganKerja from '../modules/hr/models/JenisHubunganKerja';
import Tag from '../modules/hr/models/Tag';
import LokasiKerja from '../modules/hr/models/LokasiKerja';
import StatusKaryawan from '../modules/hr/models/StatusKaryawan';

const seed = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected...');

        // Seed Employees
        const employeeCount = await Employee.count();
        let employees;

        try {
            if (employeeCount === 0) {
                console.log('Seeding employees...');
                employees = await Employee.bulkCreate([
                    {
                        nik: '123456',
                        name: 'Admin User',
                        email: 'admin@bebang.com',
                        position: 'Administrator',
                        department: 'IT',
                        joinDate: new Date(),
                        phone: '081234567890'
                    },
                    {
                        nik: '654321',
                        name: 'HR Staff',
                        email: 'hr@bebang.com',
                        position: 'HR Staff',
                        department: 'HR',
                        joinDate: new Date(),
                        phone: '080987654321'
                    },
                    {
                        nik: '111111',
                        name: 'Regular Staff',
                        email: 'staff@bebang.com',
                        position: 'Staff',
                        department: 'General',
                        joinDate: new Date(),
                        phone: '081111111111'
                    }
                ], { ignoreDuplicates: true });
                console.log('Employees seeded.');
            } else {
                console.log('Employees already exist, fetching...');
            }
            employees = await Employee.findAll();
        } catch (error) {
            console.warn('Error seeding employees:', error);
            employees = await Employee.findAll();
        }

        // Seed Users
        try {
            const userCount = await User.count();
            if (userCount === 0) {
                console.log('Seeding users...');

                const adminEmployee = employees.find(e => e.nik === '123456');
                const hrEmployee = employees.find(e => e.nik === '654321');
                const staffEmployee = employees.find(e => e.nik === '111111');

                await User.bulkCreate([
                    {
                        nik: '123456',
                        password: 'password123',
                        role: 'superadmin',
                        employee_id: adminEmployee?.id || null,
                        is_active: true
                    },
                    {
                        nik: '654321',
                        password: 'password123',
                        role: 'admin',
                        employee_id: hrEmployee?.id || null,
                        is_active: true
                    },
                    {
                        nik: '111111',
                        password: 'password123',
                        role: 'staff',
                        employee_id: staffEmployee?.id || null,
                        is_active: true
                    }
                ], { individualHooks: true, ignoreDuplicates: true });

                console.log('Users seeded.');
            } else {
                console.log('Users already exist, skipping.');
            }
        } catch (error) {
            console.warn('Error seeding users:', error);
        }

        // Seed Master Data

        // Seed Divisi
        const divisiCount = await Divisi.count();
        if (divisiCount === 0) {
            console.log('Seeding divisi...');
            await Divisi.bulkCreate([
                { nama: 'Operasional', keterangan: 'Divisi Operasional', status: 'Aktif' },
                { nama: 'Keuangan', keterangan: 'Divisi Keuangan', status: 'Aktif' },
                { nama: 'IT', keterangan: 'Divisi Teknologi Informasi', status: 'Aktif' },
                { nama: 'Human Resources', keterangan: 'Divisi SDM', status: 'Aktif' },
                { nama: 'Marketing', keterangan: 'Divisi Pemasaran', status: 'Aktif' },
            ]);
            console.log('Divisi seeded.');
        }

        // Seed Department
        const departmentCount = await Department.count();
        if (departmentCount === 0) {
            console.log('Seeding department...');
            const divisiIT = await Divisi.findOne({ where: { nama: 'IT' } });
            const divisiHR = await Divisi.findOne({ where: { nama: 'Human Resources' } });
            // Use employees fetched earlier
            const adminEmployee = employees.find(e => e.nik === '123456');

            await Department.bulkCreate([
                {
                    nama: 'IT Development',
                    divisi_id: divisiIT?.id,
                    manager_id: adminEmployee?.id,
                    keterangan: 'Department Pengembangan IT',
                    status: 'Aktif'
                },
                {
                    nama: 'IT Support',
                    divisi_id: divisiIT?.id,
                    manager_id: null,
                    keterangan: 'Department Dukungan IT',
                    status: 'Aktif'
                },
                {
                    nama: 'HR Operations',
                    divisi_id: divisiHR?.id,
                    manager_id: null,
                    keterangan: 'Department Operasional HR',
                    status: 'Aktif'
                },
            ]);
            console.log('Department seeded.');
        }

        // Seed Posisi Jabatan
        const posisiCount = await PosisiJabatan.count();
        if (posisiCount === 0) {
            console.log('Seeding posisi jabatan...');
            const deptITDev = await Department.findOne({ where: { nama: 'IT Development' } });
            const deptHR = await Department.findOne({ where: { nama: 'HR Operations' } });

            await PosisiJabatan.bulkCreate([
                { nama: 'Software Engineer', department_id: deptITDev?.id, keterangan: 'Pengembang Perangkat Lunak', status: 'Aktif' },
                { nama: 'Senior Developer', department_id: deptITDev?.id, keterangan: 'Pengembang Senior', status: 'Aktif' },
                { nama: 'HR Staff', department_id: deptHR?.id, keterangan: 'Staf HR', status: 'Aktif' },
                { nama: 'HR Manager', department_id: deptHR?.id, keterangan: 'Manajer HR', status: 'Aktif' },
            ]);
            console.log('Posisi Jabatan seeded.');
        }

        // Seed Kategori Pangkat
        const kategoriPangkatCount = await KategoriPangkat.count();
        if (kategoriPangkatCount === 0) {
            console.log('Seeding kategori pangkat...');
            await KategoriPangkat.bulkCreate([
                { nama: 'Staff', keterangan: 'Kategori Staff', status: 'Aktif' },
                { nama: 'Supervisor', keterangan: 'Kategori Supervisor', status: 'Aktif' },
                { nama: 'Manager', keterangan: 'Kategori Manager', status: 'Aktif' },
                { nama: 'Senior Manager', keterangan: 'Kategori Senior Manager', status: 'Aktif' },
            ]);
            console.log('Kategori Pangkat seeded.');
        }

        // Seed Golongan
        const golonganCount = await Golongan.count();
        if (golonganCount === 0) {
            console.log('Seeding golongan...');
            await Golongan.bulkCreate([
                { nama: 'I', keterangan: 'Golongan I', status: 'Aktif' },
                { nama: 'II', keterangan: 'Golongan II', status: 'Aktif' },
                { nama: 'III', keterangan: 'Golongan III', status: 'Aktif' },
                { nama: 'IV', keterangan: 'Golongan IV', status: 'Aktif' },
            ]);
            console.log('Golongan seeded.');
        }

        // Seed Sub Golongan
        const subGolonganCount = await SubGolongan.count();
        if (subGolonganCount === 0) {
            console.log('Seeding sub golongan...');
            await SubGolongan.bulkCreate([
                { nama: 'a', keterangan: 'Sub Golongan a', status: 'Aktif' },
                { nama: 'b', keterangan: 'Sub Golongan b', status: 'Aktif' },
                { nama: 'c', keterangan: 'Sub Golongan c', status: 'Aktif' },
                { nama: 'd', keterangan: 'Sub Golongan d', status: 'Aktif' },
            ]);
            console.log('Sub Golongan seeded.');
        }

        // Seed Jenis Hubungan Kerja
        const jenisHubunganKerjaCount = await JenisHubunganKerja.count();
        if (jenisHubunganKerjaCount === 0) {
            console.log('Seeding jenis hubungan kerja...');
            await JenisHubunganKerja.bulkCreate([
                { nama: 'Tetap', keterangan: 'Karyawan Tetap', status: 'Aktif' },
                { nama: 'Kontrak', keterangan: 'Karyawan Kontrak', status: 'Aktif' },
                { nama: 'Magang', keterangan: 'Karyawan Magang', status: 'Aktif' },
                { nama: 'Freelance', keterangan: 'Karyawan Freelance', status: 'Aktif' },
            ]);
            console.log('Jenis Hubungan Kerja seeded.');
        }

        // Seed Tag
        const tagCount = await Tag.count();
        if (tagCount === 0) {
            console.log('Seeding tag...');
            await Tag.bulkCreate([
                { nama: 'Remote', warna_tag: '#3B82F6', keterangan: 'Karyawan Remote', status: 'Aktif' },
                { nama: 'On-site', warna_tag: '#10B981', keterangan: 'Karyawan On-site', status: 'Aktif' },
                { nama: 'Hybrid', warna_tag: '#F59E0B', keterangan: 'Karyawan Hybrid', status: 'Aktif' },
                { nama: 'VIP', warna_tag: '#EF4444', keterangan: 'Karyawan VIP', status: 'Aktif' },
            ]);
            console.log('Tag seeded.');
        }

        // Seed Lokasi Kerja
        const lokasiKerjaCount = await LokasiKerja.count();
        if (lokasiKerjaCount === 0) {
            console.log('Seeding lokasi kerja...');
            await LokasiKerja.bulkCreate([
                {
                    nama: 'Kantor Pusat Jakarta',
                    alamat: 'Jl. Sudirman No. 123, Jakarta Pusat',
                    keterangan: 'Kantor Pusat',
                    status: 'Aktif'
                },
                {
                    nama: 'Kantor Cabang Surabaya',
                    alamat: 'Jl. Basuki Rahmat No. 45, Surabaya',
                    keterangan: 'Kantor Cabang',
                    status: 'Aktif'
                },
                {
                    nama: 'Kantor Cabang Bandung',
                    alamat: 'Jl. Asia Afrika No. 78, Bandung',
                    keterangan: 'Kantor Cabang',
                    status: 'Aktif'
                },
            ]);
            console.log('Lokasi Kerja seeded.');
        }

        // Seed Status Karyawan
        const statusKaryawanCount = await StatusKaryawan.count();
        if (statusKaryawanCount === 0) {
            console.log('Seeding status karyawan...');
            await StatusKaryawan.bulkCreate([
                { nama: 'Aktif', keterangan: 'Karyawan Aktif', status: 'Aktif' },
                { nama: 'Cuti', keterangan: 'Karyawan Cuti', status: 'Aktif' },
                { nama: 'Resign', keterangan: 'Karyawan Resign', status: 'Aktif' },
                { nama: 'Pensiun', keterangan: 'Karyawan Pensiun', status: 'Aktif' },
                { nama: 'Non-Aktif', keterangan: 'Karyawan Non-Aktif', status: 'Aktif' },
            ]);
            console.log('Status Karyawan seeded.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seed();
