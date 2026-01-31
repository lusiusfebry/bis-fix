
import ExcelJS from 'exceljs';
import { Op } from 'sequelize';
import sequelize from '../../../config/database';
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
import JenisHubunganKerja from '../models/JenisHubunganKerja';
import KategoriPangkat from '../models/KategoriPangkat';
import Golongan from '../models/Golongan';
import SubGolongan from '../models/SubGolongan';
import employeeService from './employee.service';
import { ImportResult, ImportError, PreviewData, ExcelMapping, ImportOptions } from '../types/import.types';

class ExcelImportService {
    async parseExcelFile(filePath: string): Promise<{ workbook: ExcelJS.Workbook; rows: any[] }> {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);

        // Assume data is in the first sheet or a sheet named "Data Karyawan" if exact name known.
        // For now, take the first visible sheet.
        const worksheet = workbook.worksheets[0];
        const rows: any[] = [];

        // Get headers from row 1
        const headers: string[] = [];
        worksheet.getRow(1).eachCell((cell, colNumber) => {
            headers[colNumber] = cell.text ? cell.text.trim() : '';
        });

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return; // Skip header

            const rowData: any = {};
            row.eachCell((cell, colNumber) => {
                const header = headers[colNumber];
                if (header) {
                    // Start from 1? exceljs cols are 1-based, array is 0-based empty at 0?
                    // headers array index matches colNumber if we assign carefully.
                    // Let's use headers dictionary or just standard conversion.
                    // Handling cell values (dates, formulas, rich text)
                    // Handling cell values (dates, formulas, rich text)
                    // @ts-ignore: cell.type comparison issue with different ValueType enums
                    if (cell.type === ExcelJS.ValueType.Date) {
                        rowData[header] = cell.value;
                    } else if (typeof cell.value === 'object' && cell.value !== null && 'text' in cell.value) {
                        rowData[header] = (cell.value as any).text;
                    } else {
                        rowData[header] = cell.text;
                        // @ts-ignore: cell.type comparison issue
                        if (cell.type !== ExcelJS.ValueType.Date) rowData[header] = cell.value?.toString().trim();
                    }
                }
            });
            // Only add if not empty
            if (Object.keys(rowData).length > 0) {
                rows.push({ ...rowData, _rowNumber: rowNumber });
            }
        });

        return { workbook, rows };
    }

    async getMappingConfiguration(workbook: ExcelJS.Workbook): Promise<ExcelMapping> {
        const mapping: ExcelMapping = {
            masterData: {},
            employeeProfile: {}
        };

        const masterDataSheet = workbook.getWorksheet('header excel vs master data'); // Fixed casing
        if (masterDataSheet) {
            masterDataSheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) return;
                // Col A (1): Master Type (not used in direct simple mapping but useful context)
                // Col B (2): Excel Header
                // Col C (3): DB Field
                const excelHeader = row.getCell(2).text?.trim();
                const dbField = row.getCell(3).text?.trim();
                if (excelHeader && dbField) {
                    mapping.masterData[excelHeader] = dbField;
                }
            });
        }

        const profileSheet = workbook.getWorksheet('header excel vs profil karyawan'); // Fixed casing
        if (profileSheet) {
            profileSheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) return;
                // Col B (2): Excel Header
                // Col D (4): DB Field
                const excelHeader = row.getCell(2).text?.trim();
                const dbField = row.getCell(4).text?.trim();
                // We might need table info from Col C (3) to know where to map.
                // For simplicity, we'll assume field names are unique enough or we use a flat map first then split.
                // Better: Store { table: field }
                if (excelHeader && dbField) {
                    mapping.employeeProfile[excelHeader] = dbField;
                }
            });
        }

        // Fallback or Hardcoded Manual Mapping if sheets missing (Likely needed for MVP testing)
        if (Object.keys(mapping.employeeProfile).length === 0) {
            // Basic Default Mapping based on common Excel headers usually provided
            // This is a safety net
            mapping.employeeProfile = {
                'No Induk Karyawan': 'nomor_induk_karyawan',
                'Nama Lengkap': 'nama_lengkap',
                'Email Perusahaan': 'email_perusahaan',
                'No Handphone': 'nomor_handphone',
                'Divisi': 'divisi_id', // Needs lookup
                'Departemen': 'department_id', // Needs lookup
                'Posisi': 'posisi_jabatan_id',
                'Status Karyawan': 'status_karyawan_id',
                'Lokasi Kerja': 'lokasi_kerja_id',
                'Tempat Lahir': 'tempat_lahir',
                'Tanggal Lahir': 'tanggal_lahir',
                'Jenis Kelamin': 'jenis_kelamin',
                'Agama': 'agama',
                'Status Pernikahan': 'status_pernikahan',
                'NIK KTP': 'nomor_ktp',
                'NPWP': 'nomor_npwp',
                'Alamat Domisili': 'alamat_domisili',
                'Tanggal Masuk': 'tanggal_masuk'
            };
        }

        return mapping;
    }

    async loadMasterDataCache() {
        // Load all master data into maps for fast lookup
        const cache: any = {
            Divisi: new Map(),
            Department: new Map(),
            PosisiJabatan: new Map(),
            StatusKaryawan: new Map(),
            LokasiKerja: new Map(),
            Tag: new Map(),
            JenisHubunganKerja: new Map(),
            KategoriPangkat: new Map(),
            Golongan: new Map(),
            SubGolongan: new Map()
        };

        const loadToCache = async (model: any, key: string) => {
            const items = await model.findAll();
            items.forEach((item: any) => {
                if (item.nama) cache[key].set(item.nama.toLowerCase().trim(), item.id);
            });
        };

        await Promise.all([
            loadToCache(Divisi, 'Divisi'),
            loadToCache(Department, 'Department'),
            loadToCache(PosisiJabatan, 'PosisiJabatan'),
            loadToCache(StatusKaryawan, 'StatusKaryawan'),
            loadToCache(LokasiKerja, 'LokasiKerja'),
            loadToCache(Tag, 'Tag'),
            loadToCache(JenisHubunganKerja, 'JenisHubunganKerja'),
            loadToCache(KategoriPangkat, 'KategoriPangkat'),
            loadToCache(Golongan, 'Golongan'),
            loadToCache(SubGolongan, 'SubGolongan'),
        ]);

        return cache;
    }

    async lookupMasterData(type: string, nama: string, cache: any): Promise<number | null> {
        if (!nama) return null;
        const normalized = nama.toLowerCase().trim();
        if (cache[type] && cache[type].has(normalized)) {
            return cache[type].get(normalized);
        }
        return null; // Could implement auto-create here
    }

    async mapExcelRowToEmployee(row: any, mapping: ExcelMapping, masterCache: any): Promise<any> {
        const employeeData: any = {};
        const personalInfoData: any = {};
        const hrInfoData: any = {};
        const familyInfoData: any = {};

        // Validation tracking object
        const rawValues: any = {};

        const getValue = (dbField: string, excelHeaderFallback?: string) => {
            const excelHeader = Object.keys(mapping.employeeProfile).find(key => mapping.employeeProfile[key] === dbField);
            const val = excelHeader ? row[excelHeader] : (excelHeaderFallback ? row[excelHeaderFallback] : undefined);
            if (dbField) rawValues[`${dbField}_raw`] = val; // Store raw for validation
            return val;
        };

        // Mappings
        employeeData.nama_lengkap = getValue('nama_lengkap', 'Nama Lengkap');
        employeeData.nomor_induk_karyawan = getValue('nomor_induk_karyawan', 'No Induk Karyawan');
        employeeData.email_perusahaan = getValue('email_perusahaan', 'Email Perusahaan');
        employeeData.nomor_handphone = getValue('nomor_handphone', 'No Handphone');

        // Foreign Keys
        const checkLookup = async (type: string, dbField: string, excelKey: string) => {
            const val = getValue(dbField, excelKey); // getValue already stores raw value
            if (val) {
                const id = await this.lookupMasterData(type, val, masterCache);
                return id;
            }
            return null;
        };

        employeeData.divisi_id = await checkLookup('Divisi', 'divisi_id', 'Divisi');
        employeeData.department_id = await checkLookup('Department', 'department_id', 'Departemen');
        employeeData.posisi_jabatan_id = await checkLookup('PosisiJabatan', 'posisi_jabatan_id', 'Posisi');
        employeeData.status_karyawan_id = await checkLookup('StatusKaryawan', 'status_karyawan_id', 'Status Karyawan');
        employeeData.lokasi_kerja_id = await checkLookup('LokasiKerja', 'lokasi_kerja_id', 'Lokasi Kerja');

        // Personal Info
        personalInfoData.tempat_lahir = getValue('tempat_lahir', 'Tempat Lahir');

        const parseDate = (val: any) => {
            if (!val) return null;
            if (val instanceof Date) return val.toISOString().split('T')[0];
            const d = new Date(val);
            return isNaN(d.getTime()) ? null : d.toISOString().split('T')[0];
        };

        personalInfoData.tanggal_lahir = parseDate(getValue('tanggal_lahir', 'Tanggal Lahir'));
        personalInfoData.jenis_kelamin = getValue('jenis_kelamin', 'Jenis Kelamin');
        personalInfoData.agama = getValue('agama', 'Agama');
        personalInfoData.status_pernikahan = getValue('status_pernikahan', 'Status Pernikahan');
        personalInfoData.nomor_ktp = getValue('nomor_ktp', 'NIK KTP');
        personalInfoData.nomor_npwp = getValue('nomor_npwp', 'NPWP');
        personalInfoData.alamat_domisili = getValue('alamat_domisili', 'Alamat Domisili');

        hrInfoData.tanggal_masuk = parseDate(getValue('tanggal_masuk', 'Tanggal Masuk'));
        hrInfoData.status_aktif = 'Aktif';

        return { employeeData, personalInfoData, hrInfoData, familyInfoData, rawValues };
    }

    async validateEmployeeData(data: any): Promise<string | null> {
        const { employeeData, rawValues } = data;

        if (!employeeData.nama_lengkap) return "Nama Lengkap wajib diisi";
        if (!employeeData.nomor_induk_karyawan) return "No Induk Karyawan wajib diisi";

        // FK Validation
        if (rawValues.divisi_id_raw && !employeeData.divisi_id) return `Divisi '${rawValues.divisi_id_raw}' tidak ditemukan dalam master data`;
        if (rawValues.department_id_raw && !employeeData.department_id) return `Department '${rawValues.department_id_raw}' tidak ditemukan`;
        if (rawValues.posisi_jabatan_id_raw && !employeeData.posisi_jabatan_id) return `Posisi '${rawValues.posisi_jabatan_id_raw}' tidak ditemukan`;
        if (rawValues.status_karyawan_id_raw && !employeeData.status_karyawan_id) return `Status Karyawan '${rawValues.status_karyawan_id_raw}' tidak ditemukan`;
        if (rawValues.lokasi_kerja_id_raw && !employeeData.lokasi_kerja_id) return `Lokasi Kerja '${rawValues.lokasi_kerja_id_raw}' tidak ditemukan`;

        return null;
    }

    async importEmployees(filePath: string, options?: ImportOptions): Promise<ImportResult> {
        const { workbook, rows } = await this.parseExcelFile(filePath);
        const mapping = await this.getMappingConfiguration(workbook);
        const masterCache = await this.loadMasterDataCache();

        const result: ImportResult = { success: 0, failed: 0, total: rows.length, errors: [] };
        const validEmployees: any[] = [];

        // Phase 1: Validation
        for (const row of rows) {
            try {
                const mappedData = await this.mapExcelRowToEmployee(row, mapping, masterCache);
                const error = await this.validateEmployeeData(mappedData);

                if (error) {
                    result.failed++;
                    result.errors.push({ row: row._rowNumber, message: error, data: row });
                } else {
                    const isDuplicate = validEmployees.some(e => e.employeeData.nomor_induk_karyawan === mappedData.employeeData.nomor_induk_karyawan);
                    if (isDuplicate) {
                        result.failed++;
                        result.errors.push({ row: row._rowNumber, message: `Duplicate NIK in file: ${mappedData.employeeData.nomor_induk_karyawan}`, data: row });
                    } else {
                        const exists = await employeeService.validateNIKUnique(mappedData.employeeData.nomor_induk_karyawan);
                        if (!exists) {
                            result.failed++;
                            result.errors.push({ row: row._rowNumber, message: `NIK ${mappedData.employeeData.nomor_induk_karyawan} sudah terdaftar`, data: row });
                        } else {
                            validEmployees.push(mappedData);
                        }
                    }
                }
            } catch (e: any) {
                result.failed++;
                result.errors.push({ row: row._rowNumber, message: e.message || 'Mapping Error', data: row });
            }
        }

        // Phase 2: Bulk Insert in Transaction
        if (validEmployees.length > 0) {
            const t = await sequelize.transaction();
            try {
                for (const item of validEmployees) {
                    try {
                        await employeeService.createEmployeeComplete(
                            item.employeeData,
                            item.personalInfoData,
                            item.hrInfoData,
                            item.familyInfoData,
                            undefined,
                            { transaction: t }
                        );
                        result.success++;
                    } catch (e: any) {
                        // If ANY insert fails, we must rollback ALL 
                        throw new Error(`DB Error for NIK ${item.employeeData.nomor_induk_karyawan}: ${e.message}`);
                    }
                }
                await t.commit();
            } catch (e: any) {
                await t.rollback();
                // If rollback, all "success" must be reverted to failed
                result.failed += result.success;
                result.success = 0;
                // Add a global error or per-item error?
                // Add specific error that caused rollback
                result.errors.push({ row: 0, message: `Import Transaction Failed: ${e.message}` });
            }
        }

        return result;
    }

    async importMasterData(filePath: string, type: string): Promise<ImportResult> {
        const { workbook, rows } = await this.parseExcelFile(filePath);
        // Look for sheet matching type name or default 'Master Data'
        // For simplicity, we scan rows and insert.
        // Assume mapping is simple: 'Nama' -> name, 'Kode' -> code

        const result: ImportResult = { success: 0, failed: 0, total: rows.length, errors: [] };

        // Define models map
        const models: any = {
            'divisi': Divisi,
            'department': Department,
            'posisi': PosisiJabatan,
            'status': StatusKaryawan,
            'lokasi': LokasiKerja
        };

        const Model = models[type.toLowerCase()];
        if (!Model) {
            throw new Error(`Master data type '${type}' not supported`);
        }

        const t = await sequelize.transaction();
        try {
            for (const row of rows) {
                try {
                    // Generic mapping: Name/Nama is required
                    const name = row['Nama'] || row['Name'] || row['nama'];
                    if (!name) throw new Error('Nama is required');

                    // Upsert? Or Create if not exist?
                    // Check existence
                    // @ts-ignore
                    const existing = await Model.findOne({ where: { nama: name }, transaction: t });
                    if (!existing) {
                        // @ts-ignore
                        await Model.create({ nama: name }, { transaction: t });
                        result.success++;
                    } else {
                        // Skip or update? Skip for now.
                        // result.success++; // Counted as processed
                    }
                } catch (e: any) {
                    result.failed++;
                    result.errors.push({ row: row._rowNumber, message: e.message, data: row });
                }
            }
            await t.commit();
        } catch (e: any) {
            await t.rollback();
            result.failed += result.success;
            result.success = 0;
            result.errors.push({ row: 0, message: `Transaction Validation Failed: ${e.message}` });
        }

        return result;
    }

    async generateErrorReport(errors: ImportError[]): Promise<Buffer> {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Error Report');
        sheet.columns = [
            { header: 'No. Baris', key: 'row', width: 10 },
            { header: 'Pesan Error', key: 'message', width: 50 },
            { header: 'Data', key: 'data', width: 100 } // JSON dump of row data?
        ];

        errors.forEach(err => {
            sheet.addRow({
                row: err.row,
                message: err.message,
                data: JSON.stringify(err.data)
            });
        });

        const buffer = await workbook.xlsx.writeBuffer();
        return Buffer.from(buffer as any);
    }
}

export default new ExcelImportService();
