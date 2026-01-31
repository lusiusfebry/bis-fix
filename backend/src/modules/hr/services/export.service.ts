
import ExcelJS from 'exceljs';
import puppeteer from 'puppeteer';
import Employee from '../models/Employee';
import EmployeePersonalInfo from '../models/EmployeePersonalInfo';
import EmployeeHRInfo from '../models/EmployeeHRInfo';
import EmployeeFamilyInfo from '../models/EmployeeFamilyInfo';
import Divisi from '../models/Divisi';
import Department from '../models/Department';
import PosisiJabatan from '../models/PosisiJabatan';
import StatusKaryawan from '../models/StatusKaryawan';
import LokasiKerja from '../models/LokasiKerja';
import Tag from '../models/Tag';
import { Op, WhereOptions } from 'sequelize';
import employeeService from './employee.service';
import moment from 'moment';

class ExportService {
    async exportEmployeesToExcel(params: any): Promise<Buffer> {
        const { search, divisi_id, department_id, status_id, posisi_jabatan_id, lokasi_kerja_id, tag_id } = params;

        const where: WhereOptions<Employee> = {};

        // Search functionality
        if (search) {
            (where as any)[Op.or] = [
                { nama_lengkap: { [Op.iLike]: `%${search}%` } },
                { nomor_induk_karyawan: { [Op.iLike]: `%${search}%` } }
            ];
        }

        // Filters
        if (divisi_id) where.divisi_id = divisi_id;
        if (department_id) where.department_id = department_id;
        if (status_id) where.status_karyawan_id = status_id;
        if (posisi_jabatan_id) where.posisi_jabatan_id = posisi_jabatan_id;
        if (lokasi_kerja_id) where.lokasi_kerja_id = lokasi_kerja_id;
        if (tag_id) where.tag_id = tag_id;

        const employees = await Employee.findAll({
            where,
            include: [
                { model: Divisi, as: 'divisi' },
                { model: Department, as: 'department' },
                { model: PosisiJabatan, as: 'posisi_jabatan' },
                { model: StatusKaryawan, as: 'status_karyawan' },
                { model: LokasiKerja, as: 'lokasi_kerja' },
                { model: Tag, as: 'tag' },
                { model: EmployeePersonalInfo, as: 'personal_info' },
                {
                    model: EmployeeHRInfo,
                    as: 'hr_info',
                    include: ['jenis_hubungan_kerja', 'kategori_pangkat', 'golongan', 'sub_golongan', 'lokasi_sebelumnya']
                },
                { model: EmployeeFamilyInfo, as: 'family_info' }
            ],
            order: [['createdAt', 'DESC']]
        });

        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'HR System';
        workbook.created = new Date();

        const headerStyle = {
            font: { bold: true },
            fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD3D3D3' } } as ExcelJS.Fill
        };

        // --- Sheet 1: Data Karyawan ---
        const sheet1 = workbook.addWorksheet('Data Karyawan');
        sheet1.columns = [
            { header: 'NIK', key: 'nik', width: 15 },
            { header: 'Nama Lengkap', key: 'nama', width: 30 },
            { header: 'Email', key: 'email', width: 25 },
            { header: 'Nomor HP', key: 'phone', width: 15 },
            { header: 'Divisi', key: 'divisi', width: 20 },
            { header: 'Departemen', key: 'department', width: 20 },
            { header: 'Posisi', key: 'posisi', width: 20 },
            { header: 'Status', key: 'status', width: 15 },
            { header: 'Lokasi', key: 'lokasi', width: 15 },
            { header: 'Tag', key: 'tag', width: 15 },
        ];
        sheet1.getRow(1).font = headerStyle.font;
        sheet1.getRow(1).fill = headerStyle.fill;

        // --- Sheet 2: Informasi Personal ---
        const sheet2 = workbook.addWorksheet('Informasi Personal');
        sheet2.columns = [
            { header: 'NIK', key: 'nik', width: 15 },
            { header: 'Nama Lengkap', key: 'nama', width: 30 },
            { header: 'Jenis Kelamin', key: 'gender', width: 15 },
            { header: 'Tempat Lahir', key: 'birth_place', width: 20 },
            { header: 'Tanggal Lahir', key: 'birth_date', width: 15 },
            { header: 'Status Pernikahan', key: 'marital_status', width: 15 },
            { header: 'Agama', key: 'religion', width: 15 },
            { header: 'Golongan Darah', key: 'blood_type', width: 10 },
            { header: 'NIK KTP', key: 'nik_ktp', width: 20 },
            { header: 'NPWP', key: 'npwp', width: 20 },
            { header: 'Alamat KTP', key: 'address_ktp', width: 40 },
            { header: 'Alamat Domisili', key: 'address_domicile', width: 40 },
        ];
        sheet2.getRow(1).font = headerStyle.font;
        sheet2.getRow(1).fill = headerStyle.fill;

        // --- Sheet 3: Informasi HR ---
        const sheet3 = workbook.addWorksheet('Informasi HR');
        sheet3.columns = [
            { header: 'NIK', key: 'nik', width: 15 },
            { header: 'Nama Lengkap', key: 'nama', width: 30 },
            { header: 'Hubungan Kerja', key: 'hubungan_kerja', width: 20 },
            { header: 'Tgl Masuk', key: 'tgl_masuk', width: 15 },
            { header: 'Tgl Permanent', key: 'tgl_permanent', width: 15 },
            { header: 'Tgl Kontrak', key: 'tgl_kontrak', width: 15 },
            { header: 'Akhir Kontrak', key: 'akhir_kontrak', width: 15 },
            { header: 'Pendidikan', key: 'pendidikan', width: 20 },
            { header: 'Jurusan', key: 'jurusan', width: 25 },
            { header: 'Sekolah', key: 'sekolah', width: 25 },
            { header: 'Kategori Pangkat', key: 'kategori_pangkat', width: 20 },
            { header: 'Golongan', key: 'golongan', width: 10 },
            { header: 'Kontak Darurat', key: 'kontak_darurat', width: 25 },
            { header: 'Telp Darurat', key: 'telp_darurat', width: 15 },
        ];
        sheet3.getRow(1).font = headerStyle.font;
        sheet3.getRow(1).fill = headerStyle.fill;

        // --- Sheet 4: Informasi Keluarga ---
        const sheet4 = workbook.addWorksheet('Informasi Keluarga');
        sheet4.columns = [
            { header: 'NIK', key: 'nik', width: 15 },
            { header: 'Nama Lengkap', key: 'nama', width: 30 },
            { header: 'Nama Pasangan', key: 'nama_pasangan', width: 25 },
            { header: 'Tgl Lahir Pasangan', key: 'tgl_lahir_pasangan', width: 15 },
            { header: 'Ayah Kandung', key: 'ayah_kandung', width: 25 },
            { header: 'Ibu Kandung', key: 'ibu_kandung', width: 25 },
            { header: 'Ayah Mertua', key: 'ayah_mertua', width: 25 },
            { header: 'Ibu Mertua', key: 'ibu_mertua', width: 25 },
            { header: 'Anak', key: 'data_anak', width: 50 },
        ];
        sheet4.getRow(1).font = headerStyle.font;
        sheet4.getRow(1).fill = headerStyle.fill;

        // Populate Data
        employees.forEach((emp: any) => {
            const common = {
                nik: emp.nomor_induk_karyawan,
                nama: emp.nama_lengkap
            };

            // Sheet 1
            sheet1.addRow({
                ...common,
                email: emp.email_kantor,
                phone: emp.nomor_hp,
                divisi: emp.divisi?.nama_divisi || '-',
                department: emp.department?.nama_department || '-',
                posisi: emp.posisi_jabatan?.nama_posisi || '-',
                status: emp.status_karyawan?.nama_status || '-',
                lokasi: emp.lokasi_kerja?.nama_lokasi || '-',
                tag: emp.tag?.nama_tag || '-'
            });

            // Sheet 2
            const personal = emp.personal_info;
            sheet2.addRow({
                ...common,
                gender: personal?.jenis_kelamin || '-',
                birth_place: personal?.tempat_lahir || '-',
                birth_date: personal?.tanggal_lahir ? moment(personal.tanggal_lahir).format('YYYY-MM-DD') : '-',
                marital_status: personal?.status_pernikahan || '-',
                religion: personal?.agama || '-',
                blood_type: personal?.golongan_darah || '-',
                nik_ktp: personal?.nik_ktp || '-',
                npwp: personal?.npwp || '-',
                address_ktp: personal?.alamat_ktp_jalan || '-',
                address_domicile: personal?.alamat_domisili_jalan || '-'
            });

            // Sheet 3
            const hr = emp.hr_info;
            sheet3.addRow({
                ...common,
                hubungan_kerja: hr?.jenis_hubungan_kerja?.nama || '-',
                tgl_masuk: hr?.tanggal_masuk ? moment(hr.tanggal_masuk).format('YYYY-MM-DD') : '-',
                tgl_permanent: hr?.tanggal_permanent ? moment(hr.tanggal_permanent).format('YYYY-MM-DD') : '-',
                tgl_kontrak: hr?.tanggal_kontrak ? moment(hr.tanggal_kontrak).format('YYYY-MM-DD') : '-',
                akhir_kontrak: hr?.tanggal_akhir_kontrak ? moment(hr.tanggal_akhir_kontrak).format('YYYY-MM-DD') : '-',
                pendidikan: hr?.tingkat_pendidikan || '-',
                jurusan: hr?.bidang_studi || '-',
                sekolah: hr?.nama_sekolah || '-',
                kategori_pangkat: hr?.kategori_pangkat?.nama || '-',
                golongan: hr?.golongan?.nama || '-',
                kontak_darurat: hr?.nama_kontak_darurat_1 || '-',
                telp_darurat: hr?.nomor_telepon_kontak_darurat_1 || '-'
            });

            // Sheet 4
            const fam = emp.family_info;
            const anakList = fam?.data_anak && Array.isArray(fam.data_anak)
                ? fam.data_anak.map((a: any) => `${a.nama} (${moment(a.tanggal_lahir).format('YYYY')})`).join(', ')
                : '-';

            sheet4.addRow({
                ...common,
                nama_pasangan: fam?.nama_pasangan || '-',
                tgl_lahir_pasangan: fam?.tanggal_lahir_pasangan ? moment(fam.tanggal_lahir_pasangan).format('YYYY-MM-DD') : '-',
                ayah_kandung: fam?.nama_ayah_kandung || '-',
                ibu_kandung: fam?.nama_ibu_kandung || '-',
                ayah_mertua: fam?.nama_ayah_mertua || '-',
                ibu_mertua: fam?.nama_ibu_mertua || '-',
                data_anak: anakList
            });
        });

        const buffer = await workbook.xlsx.writeBuffer();
        return buffer as unknown as Buffer;
    }

    async exportEmployeeProfileToPDF(employeeId: number): Promise<Buffer> {
        const employee: any = await employeeService.getEmployeeById(employeeId);

        if (!employee) {
            throw new Error('Employee not found');
        }

        const htmlContent = this.generateEmployeeProfileHTML(employee);

        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20px',
                right: '20px',
                bottom: '20px',
                left: '20px'
            }
        });

        await browser.close();
        return Buffer.from(pdfBuffer);
    }

    private generateEmployeeProfileHTML(employee: any): string {
        const formatDate = (date: any) => date ? moment(date).format('DD MMMM YYYY') : '-';
        const hr = employee.hr_info;
        const fam = employee.family_info;

        return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: 'Helvetica', 'Arial', sans-serif; color: #333; line-height: 1.6; font-size: 14px; }
                .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
                .header h1 { margin: 0; color: #1e40af; font-size: 24px; }
                .header p { margin: 5px 0 0; color: #6b7280; font-size: 14px; }
                
                .section { margin-bottom: 20px; page-break-inside: avoid; }
                .section-title { background-color: #f3f4f6; padding: 6px 12px; font-weight: bold; border-left: 4px solid #3b82f6; margin-bottom: 10px; font-size: 15px; }
                
                .grid { display: table; width: 100%; border-collapse: collapse; }
                .row { display: table-row; }
                .col { display: table-cell; padding: 4px; width: 50%; vertical-align: top; }
                .label { font-weight: bold; color: #4b5563; width: 140px; display: inline-block; font-size: 13px; }
                .value { color: #111827; font-size: 13px; }
                
                .profile-img { width: 100px; height: 100px; object-fit: cover; border-radius: 50%; border: 3px solid #e5e7eb; margin: 0 auto 10px; display: block; }
                
                table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 12px; }
                table, th, td { border: 1px solid #e5e7eb; }
                th { background-color: #f9fafb; padding: 6px; text-align: left; font-weight: bold; color: #374151; }
                td { padding: 6px; color: #4b5563; }
            </style>
        </head>
        <body>
            <div class="header">
                ${employee.foto_karyawan ? `<img src="file://${employee.foto_karyawan}" class="profile-img" />` : ''} 
                <h1>${employee.nama_lengkap}</h1>
                <p>NIK: ${employee.nomor_induk_karyawan} | ${employee.posisi_jabatan?.nama_posisi || '-'}</p>
                <p>${employee.divisi?.nama_divisi || '-'} - ${employee.department?.nama_department || '-'}</p>
            </div>

            <!-- Profile Overview (Basic Info) -->
            <div class="section">
                <div class="section-title">Informasi Dasar</div>
                <div class="grid">
                    <div class="row">
                        <div class="col"><span class="label">Lokasi Kerja:</span> <span class="value">${employee.lokasi_kerja?.nama_lokasi || '-'}</span></div>
                        <div class="col"><span class="label">Status Karyawan:</span> <span class="value">${employee.status_karyawan?.nama_status || '-'}</span></div>
                    </div>
                    <div class="row">
                        <div class="col"><span class="label">Tanggal Masuk:</span> <span class="value">${formatDate(employee.tanggal_masuk)}</span></div>
                        <div class="col"><span class="label">Email Kantor:</span> <span class="value">${employee.email_kantor || '-'}</span></div>
                    </div>
                     <div class="row">
                        <div class="col"><span class="label">No HP:</span> <span class="value">${employee.nomor_hp || '-'}</span></div>
                        <div class="col"><span class="label">Tag:</span> <span class="value">${employee.tag?.nama_tag || '-'}</span></div>
                    </div>
                </div>
            </div>

            <!-- Personal Info -->
            <div class="section">
                <div class="section-title">Informasi Personal</div>
                <div class="grid">
                    <div class="row">
                        <div class="col"><span class="label">TTL:</span> <span class="value">${employee.personal_info?.tempat_lahir || '-'}, ${formatDate(employee.personal_info?.tanggal_lahir)}</span></div>
                        <div class="col"><span class="label">Jenis Kelamin:</span> <span class="value">${employee.personal_info?.jenis_kelamin || '-'}</span></div>
                    </div>
                    <div class="row">
                        <div class="col"><span class="label">Agama:</span> <span class="value">${employee.personal_info?.agama || '-'}</span></div>
                        <div class="col"><span class="label">Status Nikah:</span> <span class="value">${employee.personal_info?.status_pernikahan || '-'}</span></div>
                    </div>
                    <div class="row">
                        <div class="col"><span class="label">Gol. Darah:</span> <span class="value">${employee.personal_info?.golongan_darah || '-'}</span></div>
                        <div class="col"><span class="label">NIK KTP:</span> <span class="value">${employee.personal_info?.nik_ktp || '-'}</span></div>
                    </div>
                    <div class="row">
                         <div class="col"><span class="label">Alamat Domisili:</span> <span class="value">${employee.personal_info?.alamat_domisili_jalan || '-'}</span></div>
                    </div>
                </div>
            </div>
            
            <!-- HR Info (New Section) -->
             <div class="section">
                <div class="section-title">Informasi Kepegawaian (HR)</div>
                <div class="grid">
                    <div class="row">
                        <div class="col"><span class="label">Hubungan Kerja:</span> <span class="value">${hr?.jenis_hubungan_kerja?.nama || '-'}</span></div>
                        <div class="col"><span class="label">Tgl Kontrak:</span> <span class="value">${formatDate(hr?.tanggal_kontrak)} s/d ${formatDate(hr?.tanggal_akhir_kontrak)}</span></div>
                    </div>
                    <div class="row">
                        <div class="col"><span class="label">Tgl Permanent:</span> <span class="value">${formatDate(hr?.tanggal_permanent)}</span></div>
                         <div class="col"><span class="label">Pangkat/Gol:</span> <span class="value">${hr?.kategori_pangkat?.nama || '-'} (${hr?.golongan?.nama || '-'})</span></div>
                    </div>
                    <div class="row">
                        <div class="col"><span class="label">Pendidikan:</span> <span class="value">${hr?.tingkat_pendidikan || '-'} - ${hr?.bidang_studi || '-'} (${hr?.nama_sekolah || '-'})</span></div>
                    </div>
                     <div class="row">
                        <div class="col"><span class="label">Kontak Darurat:</span> <span class="value">${hr?.nama_kontak_darurat_1 || '-'} (${hr?.hubungan_kontak_darurat_1 || '-'} - ${hr?.nomor_telepon_kontak_darurat_1 || '-'})</span></div>
                    </div>
                </div>
            </div>

            <!-- Family Info (Enhanced) -->
            <div class="section">
                <div class="section-title">Data Keluarga</div>
                ${this.renderFamilySection(fam)}
            </div>
        </body>
        </html>
       `;
    }

    private renderFamilySection(fam: any): string {
        if (!fam) return '<p class="value">-</p>';

        let html = '<div class="grid">';

        // Pasangan
        if (fam.nama_pasangan) {
            html += `
            <div class="row">
                <div class="col"><span class="label">Pasangan:</span> <span class="value">${fam.nama_pasangan}</span></div>
                <div class="col"><span class="label">Tgl Lahir:</span> <span class="value">${fam.tanggal_lahir_pasangan ? moment(fam.tanggal_lahir_pasangan).format('DD MMM YYYY') : '-'}</span></div>
            </div>`;
        }

        // Orang Tua
        html += `
            <div class="row">
                <div class="col"><span class="label">Ayah Kandung:</span> <span class="value">${fam.nama_ayah_kandung || '-'}</span></div>
                <div class="col"><span class="label">Ibu Kandung:</span> <span class="value">${fam.nama_ibu_kandung || '-'}</span></div>
            </div>
             <div class="row">
                <div class="col"><span class="label">Ayah Mertua:</span> <span class="value">${fam.nama_ayah_mertua || '-'}</span></div>
                <div class="col"><span class="label">Ibu Mertua:</span> <span class="value">${fam.nama_ibu_mertua || '-'}</span></div>
            </div>`;

        html += '</div>';

        // Anak Table
        if (fam.data_anak && Array.isArray(fam.data_anak) && fam.data_anak.length > 0) {
            html += '<p style="margin-top:10px; font-weight:bold; font-size:13px;">Data Anak:</p><table><thead><tr><th>Nama</th><th>Tgl Lahir</th><th>Ket</th></tr></thead><tbody>';
            fam.data_anak.forEach((anak: any) => {
                const tgl = anak.tanggal_lahir || anak.tgl_lahir; // fallback
                const ket = anak.keterangan || anak.pendidikan || '-';
                html += `<tr><td>${anak.nama}</td><td>${tgl ? moment(tgl).format('DD MMM YYYY') : '-'}</td><td>${ket}</td></tr>`;
            });
            html += '</tbody></table>';
        } else {
            html += '<p style="margin-top:5px; font-style:italic; font-size:12px;">Tidak ada data anak</p>';
        }

        return html;
    }
}

export default new ExportService();
