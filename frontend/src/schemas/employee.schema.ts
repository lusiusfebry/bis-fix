import { z } from 'zod';

export const createEmployeeSchema = z.object({
    // Tab 1: Data Diri
    nik: z.string().min(1, 'NIK wajib diisi').max(20, 'NIK maksimal 20 karakter'),
    name: z.string().min(1, 'Nama wajib diisi'),
    email: z.string().email('Email tidak valid'),
    phone: z.string().optional(),
    tempat_lahir: z.string().optional(),
    tanggal_lahir: z.string().optional(),
    jenis_kelamin: z.string().optional(),
    agama: z.string().optional(),
    status_pernikahan: z.string().optional(),
    alamat_ktp: z.string().optional(),
    alamat_domisili: z.string().optional(),

    // Tab 2: Kepegawaian (Dropdowns)
    joinDate: z.string().min(1, 'Tanggal Bergabung wajib diisi'),
    status_karyawan_id: z.number().optional(),
    jenis_hubungan_kerja_id: z.number().optional(),
    golongan_id: z.number().optional(),
    kategori_pangkat_id: z.number().optional(),
    sub_golongan_id: z.number().optional(),
    posisi_jabatan_id: z.number().min(1, 'Posisi Jabatan wajib dipilih'),
    department_id: z.number().min(1, 'Department wajib dipilih'),
    divisi_id: z.number().min(1, 'Divisi wajib dipilih'),
    lokasi_kerja_id: z.number().optional(),
    tag_id: z.number().optional(),

    // Tab 3: Keluarga
    nama_pasangan: z.string().optional(),
    jumlah_anak: z.number().optional(),

    // Tab 4: Pendidikan & Lainnya
    pendidikan_terakhir: z.string().optional(),
    jurusan: z.string().optional(),
    nama_bank: z.string().optional(),
    nomor_rekening: z.string().optional(),
    npwp: z.string().optional(),
    bpjs_kesehatan: z.string().optional(),
    bpjs_ketenagakerjaan: z.string().optional(),
});

export type EmployeeFormValues = z.infer<typeof createEmployeeSchema>;
