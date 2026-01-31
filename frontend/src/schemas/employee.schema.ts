import { z } from 'zod';
import { validateNIK, validateNPWP, validatePhoneNumber, calculateAge, validateBPJS } from '../utils/validators';
import { ERROR_MESSAGES } from '../constants/error-messages';

// Helper for custom refinements
const customRefine = (validator: (val: string) => boolean) => {
    return (val: string | undefined | null) => {
        if (!val) return true; // Skip empty
        return validator(val);
    };
};

export const employeeStep1Schema = z.object({
    // Head / Basic Info
    nama_lengkap: z.string().min(1, 'Nama lengkap wajib diisi').max(200, 'Maksimal 200 karakter'),
    nomor_induk_karyawan: z.string().min(1, 'NIK wajib diisi').max(50, 'Maksimal 50 karakter')
        .refine(customRefine(validateNIK), { message: ERROR_MESSAGES.NIK_INVALID_FORMAT }),
    foto_karyawan: z.instanceof(File).optional().or(z.string().optional()),

    // Organization
    divisi_id: z.coerce.number().optional(),
    department_id: z.coerce.number().optional(),
    posisi_jabatan_id: z.coerce.number().optional(),
    status_karyawan_id: z.coerce.number().optional(),
    lokasi_kerja_id: z.coerce.number().optional(),
    tag_id: z.coerce.number().optional(),
    manager_id: z.coerce.number().optional(),
    atasan_langsung_id: z.coerce.number().optional(),

    // Contacts
    email_perusahaan: z.string().email(ERROR_MESSAGES.EMAIL_INVALID_FORMAT).optional().or(z.literal('')),
    nomor_handphone: z.string().max(20, 'Maksimal 20 karakter').optional().or(z.literal(''))
        .refine(customRefine(validatePhoneNumber), { message: ERROR_MESSAGES.PHONE_INVALID_FORMAT }),

    // Personal Info - Biodata
    jenis_kelamin: z.enum(['Laki-laki', 'Perempuan']).optional(),
    tempat_lahir: z.string().max(100).optional(),
    tanggal_lahir: z.string().optional()
        .refine((val) => !val || calculateAge(val) >= 17, { message: ERROR_MESSAGES.AGE_BELOW_MINIMUM }),
    agama: z.string().optional(),
    golongan_darah: z.enum(['A', 'B', 'AB', 'O']).optional(),
    status_pernikahan: z.string().optional(),

    // Personal Info - Identity & Contracts
    nomor_ktp: z.string().min(16, 'No KTP minimal 16 karakter').optional().or(z.literal(''))
        .refine(customRefine(validateNIK), { message: 'No KTP harus 16 digit angka' }),
    nomor_npwp: z.string().optional()
        .refine(customRefine(validateNPWP), { message: ERROR_MESSAGES.NPWP_INVALID_FORMAT }),
    nomor_bpjs: z.string().optional()
        .refine(customRefine(validateBPJS), { message: ERROR_MESSAGES.BPJS_INVALID_FORMAT }),
    email_pribadi: z.string().email(ERROR_MESSAGES.EMAIL_INVALID_FORMAT).optional().or(z.literal('')),
    nomor_handphone_2: z.string().max(20).optional().or(z.literal(''))
        .refine(customRefine(validatePhoneNumber), { message: ERROR_MESSAGES.PHONE_INVALID_FORMAT }),
    nomor_telepon_rumah_1: z.string().max(20).optional().or(z.literal(''))
        .refine(customRefine(validatePhoneNumber), { message: ERROR_MESSAGES.PHONE_INVALID_FORMAT }),
    nomor_telepon_rumah_2: z.string().max(20).optional().or(z.literal(''))
        .refine(customRefine(validatePhoneNumber), { message: ERROR_MESSAGES.PHONE_INVALID_FORMAT }),

    // Personal Info - Address KTP
    alamat_ktp: z.string().optional(),
    kota_ktp: z.string().optional(),
    provinsi_ktp: z.string().optional(),

    // Personal Info - Address Domisili
    alamat_domisili: z.string().optional(),
    kota_domisili: z.string().optional(),
    provinsi_domisili: z.string().optional(),
    kode_pos: z.string().optional(),

    // Family Info Details
    nama_pasangan: z.string().optional(),
    tanggal_menikah: z.string().optional(),
    tanggal_cerai: z.string().optional(),
    tanggal_wafat_pasangan: z.string().optional(),
    pekerjaan_pasangan: z.string().optional(),
    jumlah_anak: z.coerce.number().optional(),

    // Bank Info
    nomor_rekening: z.string().optional(),
    nama_pemegang_rekening: z.string().optional(),
    nama_bank: z.string().optional(),
    cabang_bank: z.string().optional(),
}).superRefine((data) => {
    if (data.divisi_id && data.department_id) {
        // Should validate department belongs to divisi.
        // Since we can't async call API in sync Zod superRefine easily without side effects or complexity,
        // we usually rely on form/hook logic to clear mismatch.
        // Here we just placeholder or remove if logic is handled in UI.
        // UI cascade handles clearing, so invalid combination is unlikely unless forced.
    }
});

export type EmployeeStep1FormValues = z.infer<typeof employeeStep1Schema>;

export const employeeStep2Schema = z.object({
    // Kepegawaian (Reference Fields - Read Only in Form but validated here if needed)
    nomor_induk_karyawan: z.string().optional(),
    posisi_jabatan_id: z.coerce.number().optional(),
    divisi_id: z.coerce.number().optional(),
    department_id: z.coerce.number().optional(),
    email_perusahaan: z.string().optional(),
    manager_id: z.coerce.number().optional(),
    atasan_langsung_id: z.coerce.number().optional(),

    // Kontrak
    jenis_hubungan_kerja_id: z.coerce.number().optional(),
    tanggal_masuk: z.string().optional(), // Date string YYYY-MM-DD
    tanggal_masuk_group: z.string().optional(),
    tanggal_permanent: z.string().optional(),
    tanggal_kontrak: z.string().optional(),
    tanggal_akhir_kontrak: z.string().optional(),
    tanggal_berhenti: z.string().optional(),

    // Education
    tingkat_pendidikan: z.string().optional(),
    bidang_studi: z.string().optional(),
    nama_sekolah: z.string().optional(),
    kota_sekolah: z.string().optional(),
    status_kelulusan: z.string().optional(),
    keterangan_pendidikan: z.string().optional(),

    // Pangkat
    kategori_pangkat_id: z.coerce.number().optional(),
    golongan_pangkat_id: z.coerce.number().optional(),
    sub_golongan_pangkat_id: z.coerce.number().optional(),
    no_dana_pensiun: z.string().optional(),

    // Kontak Darurat 1
    nama_kontak_darurat_1: z.string().optional(),
    nomor_telepon_kontak_darurat_1: z.string().optional().or(z.literal(''))
        .refine(customRefine(validatePhoneNumber), { message: ERROR_MESSAGES.PHONE_INVALID_FORMAT }),
    hubungan_kontak_darurat_1: z.string().optional(),
    alamat_kontak_darurat_1: z.string().optional(),

    // Kontak Darurat 2
    nama_kontak_darurat_2: z.string().optional(),
    nomor_telepon_kontak_darurat_2: z.string().optional().or(z.literal(''))
        .refine(customRefine(validatePhoneNumber), { message: ERROR_MESSAGES.PHONE_INVALID_FORMAT }),
    hubungan_kontak_darurat_2: z.string().optional(),
    alamat_kontak_darurat_2: z.string().optional(),

    // POO/POH
    point_of_original: z.string().optional(),
    point_of_hire: z.string().optional(),

    // Seragam
    ukuran_seragam_kerja: z.string().optional(),
    ukuran_sepatu_kerja: z.string().optional(),

    // Pergerakan
    lokasi_sebelumnya_id: z.coerce.number().optional(),
    tanggal_mutasi: z.string().optional(),

    // Costing
    siklus_pembayaran_gaji: z.string().optional(),
    costing: z.string().optional(),
    assign: z.string().optional(),
    actual: z.string().optional(),
}).refine(data => {
    if (data.tanggal_kontrak && data.tanggal_akhir_kontrak) {
        return new Date(data.tanggal_akhir_kontrak) > new Date(data.tanggal_kontrak);
    }
    return true;
}, {
    message: ERROR_MESSAGES.CONTRACT_DATE_INVALID,
    path: ["tanggal_akhir_kontrak"]
}).refine(data => {
    if (data.tanggal_masuk && data.tanggal_permanent) {
        return new Date(data.tanggal_permanent) >= new Date(data.tanggal_masuk);
    }
    return true;
}, {
    message: ERROR_MESSAGES.PERMANENT_DATE_INVALID,
    path: ["tanggal_permanent"]
});

export type EmployeeStep2FormValues = z.infer<typeof employeeStep2Schema>;


export const dataAnakSchema = z.object({
    nama: z.string().min(1, 'Nama anak wajib diisi'),
    jenis_kelamin: z.enum(['Laki-laki', 'Perempuan']),
    tanggal_lahir: z.string().min(1, 'Tanggal lahir wajib diisi'),
    keterangan: z.string().optional()
});

export const dataSaudaraKandungSchema = z.object({
    nama: z.string().min(1, 'Nama saudara wajib diisi'),
    jenis_kelamin: z.enum(['Laki-laki', 'Perempuan']),
    tanggal_lahir: z.string().min(1, 'Tanggal lahir wajib diisi'),
    pendidikan_terakhir: z.string().optional(),
    pekerjaan: z.string().optional(),
    keterangan: z.string().optional()
});

export const employeeStep3Schema = z.object({
    // Pasangan
    tanggal_lahir_pasangan: z.string().optional(),
    pendidikan_terakhir_pasangan: z.string().optional(),
    keterangan_pasangan: z.string().optional(),

    // Saudara Kandung
    anak_ke: z.coerce.number().optional(),
    jumlah_saudara_kandung: z.coerce.number().max(5, 'Maksimal 5 saudara kandung').optional(),

    // Orang Tua Kandung
    nama_ayah_kandung: z.string().optional(),
    nama_ibu_kandung: z.string().optional(),
    alamat_orang_tua: z.string().optional(),

    // Mertua
    nama_ayah_mertua: z.string().optional(),
    tanggal_lahir_ayah_mertua: z.string().optional(),
    pendidikan_terakhir_ayah_mertua: z.string().optional(),
    keterangan_ayah_mertua: z.string().optional(),
    nama_ibu_mertua: z.string().optional(),
    tanggal_lahir_ibu_mertua: z.string().optional(),
    pendidikan_terakhir_ibu_mertua: z.string().optional(),
    keterangan_ibu_mertua: z.string().optional(),

    // Repeatable Fields
    data_anak: z.array(dataAnakSchema).optional(),
    data_saudara_kandung: z.array(dataSaudaraKandungSchema).max(5, 'Maksimal 5 saudara kandung').optional(),
    // Hidden field to cross-validate with Step 1 data
    jumlah_anak_step1: z.coerce.number().optional(),
}).superRefine((data, ctx) => {
    if (data.jumlah_anak_step1 !== undefined && data.jumlah_anak_step1 !== null) {
        if (data.data_anak && data.data_anak.length > data.jumlah_anak_step1) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Jumlah data anak (${data.data_anak.length}) tidak boleh melebihi jumlah anak yang diisi (${data.jumlah_anak_step1})`,
                path: ["data_anak"]
            });
        }
    }
});

export type EmployeeStep3FormValues = z.infer<typeof employeeStep3Schema>;
