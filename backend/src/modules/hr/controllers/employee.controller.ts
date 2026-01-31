import { Request, Response, NextFunction } from 'express';
import employeeService from '../services/employee.service';

class EmployeeController {
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const employees = await employeeService.getAllEmployees(req.query);
            res.json({ data: employees });
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

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const employeeData = req.body; // Multer parses body including non-file fields
            const personalInfoData = req.body; // Assuming flat structure or specialized handling
            const hrInfoData = req.body; // Same here, extract relevant fields or assume flat
            const familyInfoData = req.body;
            const photoPath = req.file ? `/uploads/employees/photos/${req.file.filename}` : undefined;

            const isUnique = await employeeService.validateNIKUnique(employeeData.nomor_induk_karyawan);
            if (!isUnique) {
                return res.status(400).json({ message: 'NIK already exists' });
            }

            const employee = await employeeService.createEmployeeComplete(employeeData, personalInfoData, hrInfoData, familyInfoData, photoPath);

            // Generate QR Code for response (Verification Comment 1)
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

            // Generate QR Code for response (Verification Comment 1)
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
