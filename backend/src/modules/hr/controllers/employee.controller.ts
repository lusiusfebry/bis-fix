import { Request, Response, NextFunction } from 'express';
import employeeService from '../services/employee.service';

class EmployeeController {
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            // Apply department filter if set by middleware (for managers)
            const queryParams = { ...req.query };

            if (req.departmentFilter) {
                // Force department_id to be what specific manager is allowed to see
                queryParams.department_id = req.departmentFilter.toString();
            }

            const employees = await employeeService.getAllEmployees(queryParams);
            res.json(employees);
        } catch (error) {
            next(error);
        }
    }

    async getOne(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const employee = await employeeService.getEmployeeWithDetails(id);
            if (!employee) return res.status(404).json({ message: 'Employee not found' });
            res.json({ data: employee });
        } catch (error) {
            next(error);
        }
    }

    async getBase(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const employee = await employeeService.getEmployeeBase(id);
            if (!employee) return res.status(404).json({ message: 'Employee not found' });
            res.json({ data: employee });
        } catch (error) {
            next(error);
        }
    }

    async getPersonal(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const employee = await employeeService.getEmployeePersonalInfo(id);
            if (!employee) return res.status(404).json({ message: 'Employee not found' });
            res.json({ data: employee.personal_info });
        } catch (error) {
            next(error);
        }
    }

    async getEmployment(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const employee = await employeeService.getEmployeeEmploymentData(id);
            if (!employee) return res.status(404).json({ message: 'Employee not found' });
            res.json({ data: employee.hr_info });
        } catch (error) {
            next(error);
        }
    }

    async getFamily(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const employee = await employeeService.getEmployeeFamilyData(id);
            if (!employee) return res.status(404).json({ message: 'Employee not found' });
            res.json({ data: employee.family_info });
        } catch (error) {
            next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body;
            const photoPath = req.file ? `/uploads/employees/photos/${req.file.filename}` : undefined;

            // 1. Map to Employee Attributes (Main Table)
            const employeeData: any = {
                nama_lengkap: body.nama_lengkap,
                nomor_induk_karyawan: body.nomor_induk_karyawan,
                email_perusahaan: body.email_perusahaan,
                nomor_handphone: body.nomor_handphone,

                divisi_id: body.divisi_id ? parseInt(body.divisi_id) : undefined,
                department_id: body.department_id ? parseInt(body.department_id) : undefined,
                posisi_jabatan_id: body.posisi_jabatan_id ? parseInt(body.posisi_jabatan_id) : undefined,
                status_karyawan_id: body.status_karyawan_id ? parseInt(body.status_karyawan_id) : undefined,
                lokasi_kerja_id: body.lokasi_kerja_id ? parseInt(body.lokasi_kerja_id) : undefined,
                tag_id: body.tag_id ? parseInt(body.tag_id) : undefined,
                manager_id: body.manager_id ? parseInt(body.manager_id) : undefined,
                atasan_langsung_id: body.atasan_langsung_id ? parseInt(body.atasan_langsung_id) : undefined,
                kategori_pangkat_id: body.kategori_pangkat_id ? parseInt(body.kategori_pangkat_id) : undefined,
            };

            // 2. Map to Personal Info Attributes
            const personalInfoData: any = {
                jenis_kelamin: body.jenis_kelamin,
                tempat_lahir: body.tempat_lahir,
                tanggal_lahir: body.tanggal_lahir,
                alamat_domisili: body.alamat_domisili,
                kota_domisili: body.kota_domisili,
                provinsi_domisili: body.provinsi_domisili,
                kode_pos: body.kode_pos,
                alamat_ktp: body.alamat_ktp,
                kota_ktp: body.kota_ktp,
                provinsi_ktp: body.provinsi_ktp,
                agama: body.agama,
                status_pernikahan: body.status_pernikahan,
                golongan_darah: body.golongan_darah,
                nama_pasangan: body.nama_pasangan,
                pekerjaan_pasangan: body.pekerjaan_pasangan,
                tanggal_menikah: body.tanggal_menikah,
                jumlah_anak: body.jumlah_anak ? parseInt(body.jumlah_anak) : 0,
                nomor_rekening: body.nomor_rekening,
                nama_bank: body.nama_bank,
                cabang_bank: body.cabang_bank,
                nama_pemegang_rekening: body.nama_pemegang_rekening,
                nomor_npwp: body.nomor_npwp,
                nomor_bpjs: body.nomor_bpjs,
                nomor_ktp: body.nomor_ktp,
                email_pribadi: body.email_pribadi,
                nomor_handphone_2: body.nomor_handphone_2,
                nomor_telepon_rumah_1: body.nomor_telepon_rumah_1,
            };

            // 3. Map to HR Info Attributes
            const hrInfoData: any = {
                jenis_hubungan_kerja_id: body.jenis_hubungan_kerja_id ? parseInt(body.jenis_hubungan_kerja_id) : undefined,
                tanggal_masuk_group: body.tanggal_masuk_group,
                tanggal_masuk: body.tanggal_masuk || body.joinDate,
                tanggal_permanent: body.tanggal_permanent,
                tanggal_kontrak: body.tanggal_kontrak,
                tanggal_akhir_kontrak: body.tanggal_akhir_kontrak,
                tanggal_berhenti: body.tanggal_berhenti,

                tingkat_pendidikan: body.tingkat_pendidikan || body.pendidikan_terakhir,
                bidang_studi: body.bidang_studi || body.jurusan,
                nama_sekolah: body.nama_sekolah,
                kota_sekolah: body.kota_sekolah,
                status_kelulusan: body.status_kelulusan,
                keterangan_pendidikan: body.keterangan_pendidikan,

                kategori_pangkat_id: body.kategori_pangkat_id ? parseInt(body.kategori_pangkat_id) : undefined,
                golongan_pangkat_id: body.golongan_pangkat_id || (body.golongan_id ? parseInt(body.golongan_id) : undefined),
                sub_golongan_pangkat_id: body.sub_golongan_pangkat_id || (body.sub_golongan_id ? parseInt(body.sub_golongan_id) : undefined),
                no_dana_pensiun: body.no_dana_pensiun,

                nama_kontak_darurat_1: body.nama_kontak_darurat_1,
                nomor_telepon_kontak_darurat_1: body.nomor_telepon_kontak_darurat_1,
                hubungan_kontak_darurat_1: body.hubungan_kontak_darurat_1,
                alamat_kontak_darurat_1: body.alamat_kontak_darurat_1,

                nama_kontak_darurat_2: body.nama_kontak_darurat_2,
                nomor_telepon_kontak_darurat_2: body.nomor_telepon_kontak_darurat_2,
                hubungan_kontak_darurat_2: body.hubungan_kontak_darurat_2,
                alamat_kontak_darurat_2: body.alamat_kontak_darurat_2,

                point_of_original: body.point_of_original,
                point_of_hire: body.point_of_hire,
                ukuran_seragam_kerja: body.ukuran_seragam_kerja,
                ukuran_sepatu_kerja: body.ukuran_sepatu_kerja,

                lokasi_sebelumnya_id: body.lokasi_sebelumnya_id ? parseInt(body.lokasi_sebelumnya_id) : undefined,
                tanggal_mutasi: body.tanggal_mutasi,
                siklus_pembayaran_gaji: body.siklus_pembayaran_gaji,
                costing: body.costing,
                assign: body.assign,
                actual: body.actual,
            };

            // 4. Map to Family Info Attributes
            const familyInfoData: any = {
                tanggal_lahir_pasangan: body.tanggal_lahir_pasangan,
                pendidikan_terakhir_pasangan: body.pendidikan_terakhir_pasangan,
                keterangan_pasangan: body.keterangan_pasangan,

                anak_ke: body.anak_ke ? parseInt(body.anak_ke) : undefined,
                jumlah_saudara_kandung: body.jumlah_saudara_kandung ? parseInt(body.jumlah_saudara_kandung) : 0,

                nama_ayah_mertua: body.nama_ayah_mertua,
                tanggal_lahir_ayah_mertua: body.tanggal_lahir_ayah_mertua,
                pendidikan_terakhir_ayah_mertua: body.pendidikan_terakhir_ayah_mertua,
                keterangan_ayah_mertua: body.keterangan_ayah_mertua,

                nama_ibu_mertua: body.nama_ibu_mertua,
                tanggal_lahir_ibu_mertua: body.tanggal_lahir_ibu_mertua,
                pendidikan_terakhir_ibu_mertua: body.pendidikan_terakhir_ibu_mertua,
                keterangan_ibu_mertua: body.keterangan_ibu_mertua,

                nama_ayah_kandung: body.nama_ayah_kandung,
                nama_ibu_kandung: body.nama_ibu_kandung,
                alamat_orang_tua: body.alamat_orang_tua,

                data_anak: body.data_anak, // Service handles parsing if it's string
                data_saudara_kandung: body.data_saudara_kandung,
            };

            const isUnique = await employeeService.validateNIKUnique(employeeData.nomor_induk_karyawan);
            if (!isUnique) {
                return res.status(400).json({ message: 'NIK already exists' });
            }

            const employee = await employeeService.createEmployeeComplete(
                employeeData,
                personalInfoData,
                hrInfoData,
                familyInfoData,
                photoPath
            );

            // Generate QR Code for response
            let qrCodeData = null;
            if (employee && employee.nomor_induk_karyawan) {
                try {
                    const qrResult = await employeeService.getEmployeeQRCode(employee.id);
                    qrCodeData = qrResult.qrCode;
                } catch (e) {
                    console.warn('Failed to generate QR code on create:', e);
                }
            }

            res.status(201).json({
                status: 'success',
                data: employee ? {
                    ...employee.toJSON(),
                    qrCode: qrCodeData
                } : null
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const employeeData = req.body;
            const personalInfoData = req.body;
            const hrInfoData = req.body;
            const familyInfoData = req.body;
            const photoPath = req.file ? `/uploads/employees/photos/${req.file.filename}` : undefined;

            if (employeeData.nomor_induk_karyawan) {
                const isUnique = await employeeService.validateNIKUnique(employeeData.nomor_induk_karyawan, id);
                if (!isUnique) {
                    return res.status(400).json({ message: 'NIK already exists' });
                }
            }

            const employee = await employeeService.updateEmployeeComplete(id, employeeData, personalInfoData, hrInfoData, familyInfoData, photoPath);

            // Generate QR Code for response
            let qrCodeData = null;
            if (employee && employee.nomor_induk_karyawan) {
                try {
                    const qrResult = await employeeService.getEmployeeQRCode(employee.id);
                    qrCodeData = qrResult.qrCode;
                } catch (e) {
                    console.warn('Failed to generate QR code on update:', e);
                }
            }

            res.json({
                data: employee ? {
                    ...employee.toJSON(),
                    qrCode: qrCodeData
                } : null
            });
        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            await employeeService.deleteEmployee(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    async getQRCode(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const result = await employeeService.getEmployeeQRCode(id);
            res.json({
                success: true,
                data: result
            });
        } catch (error: any) {
            if (error.message === 'EMPLOYEE_NOT_FOUND') {
                res.status(404).json({ success: false, message: 'Employee not found' });
            } else if (error.message === 'NIK_MISSING') {
                res.status(400).json({ success: false, message: 'Employee NIK is missing' });
            } else {
                next(error);
            }
        }
    }

    async downloadQRCode(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const { buffer, filename } = await employeeService.getEmployeeQRCodeBuffer(id);

            res.setHeader('Content-Type', 'image/png');
            res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
            res.send(buffer);
        } catch (error: any) {
            if (error.message === 'EMPLOYEE_NOT_FOUND') {
                res.status(404).json({ success: false, message: 'Employee not found' });
            } else if (error.message === 'NIK_MISSING') {
                res.status(400).json({ success: false, message: 'Employee NIK is missing' });
            } else {
                next(error);
            }
        }
    }
}

export default new EmployeeController();
