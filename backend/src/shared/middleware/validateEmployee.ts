import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { validateNIK, validateNPWP, validateBPJS, validatePhoneNumber, validateAge } from '../utils/validators';
import { ERROR_MESSAGES } from '../constants/error-messages';

// Helper for custom refinements
const customRefine = (validator: (val: string) => { valid: boolean; message?: string }) => {
    return (val: string | undefined | null) => {
        if (!val) return true; // Skip empty
        return validator(val).valid;
    };
};



export const employeeHeadSchema = z.object({
    nama_lengkap: z.string().min(1, { message: 'Nama lengkap wajib diisi' }).max(200),
    nomor_induk_karyawan: z.string().min(1).max(50)
        .refine(customRefine(validateNIK), { message: ERROR_MESSAGES.NIK_INVALID_FORMAT }),
    divisi_id: z.string().or(z.number()).optional().transform(val => val ? Number(val) : undefined),
    department_id: z.string().or(z.number()).optional().transform(val => val ? Number(val) : undefined),
    manager_id: z.string().or(z.number()).optional().transform(val => val ? Number(val) : undefined),
    atasan_langsung_id: z.string().or(z.number()).optional().transform(val => val ? Number(val) : undefined),
    posisi_jabatan_id: z.string().or(z.number()).optional().transform(val => val ? Number(val) : undefined),
    email_perusahaan: z.string().email({ message: ERROR_MESSAGES.EMAIL_INVALID_FORMAT }).optional().or(z.literal('')),
    nomor_handphone: z.string().optional().or(z.literal(''))
        .refine(customRefine(validatePhoneNumber), { message: ERROR_MESSAGES.PHONE_INVALID_FORMAT }),
    status_karyawan_id: z.string().or(z.number()).optional().transform(val => val ? Number(val) : undefined),
    lokasi_kerja_id: z.string().or(z.number()).optional().transform(val => val ? Number(val) : undefined),
    tag_id: z.string().or(z.number()).optional().transform(val => val ? Number(val) : undefined),
});

export const employeePersonalInfoSchema = z.object({
    jenis_kelamin: z.enum(['Laki-laki', 'Perempuan']).optional(),
    tempat_lahir: z.string().max(100).optional(),
    tanggal_lahir: z.string().optional()
        .refine((val) => !val || validateAge(val, 17).valid, { message: ERROR_MESSAGES.AGE_BELOW_MINIMUM }),
    email_pribadi: z.string().email({ message: ERROR_MESSAGES.EMAIL_INVALID_FORMAT }).optional().or(z.literal('')),
    agama: z.string().optional(),
    golongan_darah: z.enum(['A', 'B', 'AB', 'O']).optional(),
    nomor_kartu_keluarga: z.string().optional(), // No specific validaton requested, maybe generic length?
    nomor_ktp: z.string().optional()
        .refine(customRefine(validateNIK), { message: 'No KTP harus 16 digit angka' }),
    nomor_npwp: z.string().optional()
        .refine(customRefine(validateNPWP), { message: ERROR_MESSAGES.NPWP_INVALID_FORMAT }),
    nomor_bpjs: z.string().optional()
        .refine(customRefine(validateBPJS), { message: ERROR_MESSAGES.BPJS_INVALID_FORMAT }),
    no_nik_kk: z.string().optional(),
    status_pajak: z.string().optional(),
    alamat_domisili: z.string().optional(),
    kota_domisili: z.string().optional(),
    provinsi_domisili: z.string().optional(),
    alamat_ktp: z.string().optional(),
    kota_ktp: z.string().optional(),
    provinsi_ktp: z.string().optional(),
    nomor_handphone_2: z.string().optional().or(z.literal(''))
        .refine(customRefine(validatePhoneNumber), { message: ERROR_MESSAGES.PHONE_INVALID_FORMAT }),
    nomor_telepon_rumah_1: z.string().optional().or(z.literal(''))
        .refine(customRefine(validatePhoneNumber), { message: ERROR_MESSAGES.PHONE_INVALID_FORMAT }),
    nomor_telepon_rumah_2: z.string().optional().or(z.literal(''))
        .refine(customRefine(validatePhoneNumber), { message: ERROR_MESSAGES.PHONE_INVALID_FORMAT }),
    status_pernikahan: z.string().optional(),
    nama_pasangan: z.string().optional(),
    tanggal_menikah: z.string().optional(),
    tanggal_cerai: z.string().optional(),
    tanggal_wafat_pasangan: z.string().optional(),
    pekerjaan_pasangan: z.string().optional(),
    jumlah_anak: z.string().or(z.number()).optional().transform(val => val ? Number(val) : 0),
    nomor_rekening: z.string().optional(),
    nama_pemegang_rekening: z.string().optional(),
    nama_bank: z.string().optional(),
    cabang_bank: z.string().optional(),
});

export const employeeHRInfoSchema = z.object({
    jenis_hubungan_kerja_id: z.string().or(z.number()).optional().transform(val => val ? Number(val) : undefined),
    tanggal_masuk: z.string().optional(),
    tanggal_berhenti: z.string().optional(),
    tanggal_kontrak: z.string().optional(),
    tanggal_akhir_kontrak: z.string().optional(),
    tanggal_permanent: z.string().optional(),
    kategori_pangkat_id: z.string().or(z.number()).optional().transform(val => val ? Number(val) : undefined),
    golongan_pangkat_id: z.string().or(z.number()).optional().transform(val => val ? Number(val) : undefined),
    sub_golongan_pangkat_id: z.string().or(z.number()).optional().transform(val => val ? Number(val) : undefined),
    lokasi_sebelumnya_id: z.string().or(z.number()).optional().transform(val => val ? Number(val) : undefined),
}).refine((data) => {
    if (data.tanggal_kontrak && data.tanggal_akhir_kontrak) {
        return new Date(data.tanggal_akhir_kontrak) > new Date(data.tanggal_kontrak);
    }
    return true;
}, { message: ERROR_MESSAGES.CONTRACT_DATE_INVALID, path: ['tanggal_akhir_kontrak'] })
    .refine((data) => {
        if (data.tanggal_masuk && data.tanggal_permanent) {
            return new Date(data.tanggal_permanent) >= new Date(data.tanggal_masuk);
        }
        return true;
    }, { message: ERROR_MESSAGES.PERMANENT_DATE_INVALID, path: ['tanggal_permanent'] });


export const validateEmployeeCreate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = req.body;

        // Extract and validate parts
        await employeeHeadSchema.parseAsync(body);
        await employeePersonalInfoSchema.parseAsync(body);
        await employeeHRInfoSchema.parseAsync(body);

        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: 'Validation Error',
                errors: error.issues.map(issue => ({
                    field: issue.path.join('.'),
                    message: issue.message
                }))
            });
        }
        next(error);
    }
};

export const validateEmployeeUpdate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = req.body;

        await employeeHeadSchema.partial().parseAsync(body);
        await employeePersonalInfoSchema.partial().parseAsync(body);
        await employeeHRInfoSchema.partial().parseAsync(body);

        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: 'Validation Error',
                errors: error.issues.map(issue => ({
                    field: issue.path.join('.'),
                    message: issue.message
                }))
            });
        }
        next(error);
    }
};
