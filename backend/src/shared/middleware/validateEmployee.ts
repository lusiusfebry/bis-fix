import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const employeeHeadSchema = z.object({
    nama_lengkap: z.string().min(1).max(200),
    nomor_induk_karyawan: z.string().min(1).max(50),
    divisi_id: z.string().or(z.number()).optional().transform(val => val ? Number(val) : undefined),
    department_id: z.string().or(z.number()).optional().transform(val => val ? Number(val) : undefined),
    manager_id: z.string().or(z.number()).optional().transform(val => val ? Number(val) : undefined),
    atasan_langsung_id: z.string().or(z.number()).optional().transform(val => val ? Number(val) : undefined),
    posisi_jabatan_id: z.string().or(z.number()).optional().transform(val => val ? Number(val) : undefined),
    email_perusahaan: z.string().email().optional().or(z.literal('')),
    nomor_handphone: z.string().max(20).optional().or(z.literal('')),
    status_karyawan_id: z.string().or(z.number()).optional().transform(val => val ? Number(val) : undefined),
    lokasi_kerja_id: z.string().or(z.number()).optional().transform(val => val ? Number(val) : undefined),
    tag_id: z.string().or(z.number()).optional().transform(val => val ? Number(val) : undefined),
});

export const employeePersonalInfoSchema = z.object({
    jenis_kelamin: z.enum(['Laki-laki', 'Perempuan']).optional(),
    tempat_lahir: z.string().max(100).optional(),
    tanggal_lahir: z.string().optional(), // format validation could be added
    email_pribadi: z.string().email().optional().or(z.literal('')),
    agama: z.string().optional(),
    golongan_darah: z.enum(['A', 'B', 'AB', 'O']).optional(),
    nomor_kartu_keluarga: z.string().optional(),
    nomor_ktp: z.string().optional(),
    nomor_npwp: z.string().optional(),
    nomor_bpjs: z.string().optional(),
    no_nik_kk: z.string().optional(),
    status_pajak: z.string().optional(),
    alamat_domisili: z.string().optional(),
    kota_domisili: z.string().optional(),
    provinsi_domisili: z.string().optional(),
    alamat_ktp: z.string().optional(),
    kota_ktp: z.string().optional(),
    provinsi_ktp: z.string().optional(),
    nomor_handphone_2: z.string().optional(),
    nomor_telepon_rumah_1: z.string().optional(),
    nomor_telepon_rumah_2: z.string().optional(),
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

export const validateEmployeeCreate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Since we are using FormData, values might be strings/JSON strings
        // We'll parse purely the fields we know about. 
        // Note: Middleware like multer populates req.body before this if configured correctly.
        // However, if complex nested objects are sent as JSON strings in a field, we might need manual parsing.
        // Assuming client sends flat fields matching the schema or structured if properly handled by backend setup.
        // Based on plan, we will handle `employeeData` and `personalInfoData` potentially as separate objects or merged.
        // But usually FormData is flat. Let's assume flat or specifically named keys.
        // The plan says "Extract `employeeData` and `personalInfoData` from `req.body`" in Controller.
        // Validation might be better done inside controller or here if structure is known.
        // Because of FormData, req.body will have flat keys like 'nama_lengkap', 'jenis_kelamin', etc.
        // unless client sends `employee[nama_lengkap]` etc.
        // To be safe and compliant with the plan instructions "Extract... from req.body" in controller implies controller does extraction.
        // This middleware might just validate the prepared objects or we can skip middleware validation and do it in controller using safeParse.
        // BUT the plan says "Create Validation Schema... Export middleware function".
        // So I will implement generic middleware that expects flat body for now or specific structure.
        // Let's assume the Controller extracts and THis middleware is generic or maybe we use `zod` directly in controller or route.
        // Instructions: "Export middleware function `validateEmployeeCreate`".

        // Let's validate strictly what's required.
        const body = req.body;

        // Check if data is nested or flat. If using FormData often flat.
        // Let's try to validate the merged body against both schemas.
        await employeeHeadSchema.parseAsync(body);
        await employeePersonalInfoSchema.parseAsync(body);

        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: 'Validation Error',
                errors: error.issues
            });
        }
        next(error);
    }
};

export const validateEmployeeUpdate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = req.body;
        // Partial validation for update? Or full? usually full for PUT, partial for PATCH.
        // Plan says PUT.
        await employeeHeadSchema.partial().parseAsync(body);
        await employeePersonalInfoSchema.partial().parseAsync(body);
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: 'Validation Error',
                errors: error.issues
            });
        }
        next(error);
    }
};
