import { z } from 'zod';

export const employeeStep1Schema = z.object({
    // Head / Basic Info
    nama_lengkap: z.string().min(1, 'Nama lengkap wajib diisi').max(200, 'Maksimal 200 karakter'),
    nomor_induk_karyawan: z.string().min(1, 'NIK wajib diisi').max(50, 'Maksimal 50 karakter'),
    foto_karyawan: z.instanceof(File).optional().or(z.string().optional()), // File object or URL string (if existing)

    // Organization (Optional as per backend, but good to have)
    divisi_id: z.coerce.number().optional(),
    department_id: z.coerce.number().optional(),
    posisi_jabatan_id: z.coerce.number().optional(),
    status_karyawan_id: z.coerce.number().optional(),
    lokasi_kerja_id: z.coerce.number().optional(),
    tag_id: z.coerce.number().optional(),
    manager_id: z.coerce.number().optional(),
    atasan_langsung_id: z.coerce.number().optional(),

    // Contacts
    email_perusahaan: z.string().email('Format email tidak valid').optional().or(z.literal('')),
    nomor_handphone: z.string().max(20, 'Maksimal 20 karakter').optional(),

    // Personal Info - Biodata
    jenis_kelamin: z.enum(['Laki-laki', 'Perempuan']).optional(),
    tempat_lahir: z.string().max(100).optional(),
    tanggal_lahir: z.string().optional(),
    agama: z.string().optional(),
    golongan_darah: z.enum(['A', 'B', 'AB', 'O']).optional(),
    status_pernikahan: z.string().optional(),

    // Personal Info - Identity
    nomor_ktp: z.string().min(16, 'No KTP minimal 16 karakter').optional().or(z.literal('')), // Usually 16 digits
    nomor_npwp: z.string().optional(),
    email_pribadi: z.string().email('Format email tidak valid').optional().or(z.literal('')),

    // Personal Info - Address
    alamat_domisili: z.string().optional(),
    kota_domisili: z.string().optional(),
    provinsi_domisili: z.string().optional(),
    kode_pos: z.string().optional(), // Not in model yet but good for UI
});

export type EmployeeStep1FormValues = z.infer<typeof employeeStep1Schema>;
