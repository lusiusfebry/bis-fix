import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = path.join(process.cwd(), 'uploads/employees/photos');

// Ensure directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const nik = req.body.nomor_induk_karyawan || 'unknown';
        cb(null, `${uniqueSuffix}-${nik}-${file.originalname}`);
    }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPG, JPEG, and PNG are allowed.'));
    }
};

export const uploadEmployeePhoto = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB
    },
    fileFilter: fileFilter
});

const excelUploadDir = path.join(process.cwd(), 'uploads/imports/excel');

if (!fs.existsSync(excelUploadDir)) {
    fs.mkdirSync(excelUploadDir, { recursive: true });
}

const excelStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, excelUploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
});

const excelFileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
    ];
    // Check extension as well because mime types can be tricky
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedTypes.includes(file.mimetype) || ['.xlsx', '.xls'].includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only Excel files (.xlsx, .xls) are allowed.'));
    }
};

export const uploadExcelFile = multer({
    storage: excelStorage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    },
    fileFilter: excelFileFilter
});
