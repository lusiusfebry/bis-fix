
import ExcelJS from 'exceljs';
import path from 'path';

const outputPath = path.resolve(__dirname, '../../../../frontend/public/template-karyawan.xlsx');

const workbook = new ExcelJS.Workbook();
const sheet = workbook.addWorksheet('Data Karyawan');

// Define Columns
sheet.columns = [
    { header: 'No Induk Karyawan', key: 'nik', width: 20 },
    { header: 'Nama Lengkap', key: 'nama', width: 30 },
    { header: 'Email Perusahaan', key: 'email', width: 30 },
    { header: 'No Handphone', key: 'hp', width: 15 },
    { header: 'Divisi', key: 'divisi', width: 20 },
    { header: 'Departemen', key: 'departemen', width: 20 },
    { header: 'Posisi', key: 'posisi', width: 20 },
    { header: 'Status Karyawan', key: 'status', width: 15 },
    { header: 'Lokasi Kerja', key: 'lokasi', width: 15 },
    { header: 'Tempat Lahir', key: 'tempat_lahir', width: 15 },
    { header: 'Tanggal Lahir', key: 'tgl_lahir', width: 15 },
    { header: 'Jenis Kelamin', key: 'gender', width: 15 },
    { header: 'Agama', key: 'agama', width: 15 },
    { header: 'Status Pernikahan', key: 'pernikahan', width: 15 },
    { header: 'NIK KTP', key: 'ktp', width: 20 },
    { header: 'NPWP', key: 'npwp', width: 20 },
    { header: 'Alamat Domisili', key: 'alamat', width: 40 },
    { header: 'Tanggal Masuk', key: 'tgl_masuk', width: 15 },
];

// Styling Header
const headerRow = sheet.getRow(1);
headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF2F75B5' } // Blue headers
};
headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
headerRow.commit();

// Data Validations
// Gender: L/P
sheet.getColumn('gender').eachCell((cell, rowNumber) => {
    if (rowNumber > 1) {
        cell.dataValidation = {
            type: 'list',
            allowBlank: true,
            formulae: ['"L,P"']
        };
    }
});

// Helper Comments
sheet.getCell('A1').note = 'Wajib Diisi. ID unik karyawan.';
sheet.getCell('B1').note = 'Wajib Diisi. Nama lengkap sesuai KTP.';
sheet.getCell('K1').note = 'Format: YYYY-MM-DD (Contoh: 1990-12-31)';
sheet.getCell('R1').note = 'Format: YYYY-MM-DD (Contoh: 2024-01-01)';

// Add a sample row (Optional, can be removed by user)
sheet.addRow({
    nik: '123456',
    nama: 'Contoh Karyawan',
    email: 'contoh@perusahaan.com',
    hp: '08123456789',
    divisi: 'IT',
    departemen: 'Development',
    posisi: 'Staff',
    status: 'Tetap',
    lokasi: 'Head Office',
    tempat_lahir: 'Jakarta',
    tgl_lahir: '1990-01-01',
    gender: 'L',
    agama: 'Islam',
    pernikahan: 'Lajang',
    ktp: '3171234567890001',
    npwp: '12.345.678.9-012.000',
    alamat: 'Jl. Contoh No. 1',
    tgl_masuk: '2024-01-01'
});

console.log(`Generating template at: ${outputPath}`);
workbook.xlsx.writeFile(outputPath)
    .then(() => {
        console.log('Template created successfully!');
    })
    .catch((err) => {
        console.error('Error creating template:', err);
    });
