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
            // Default to base + all for backward compatibility or strict base if requested?
            // "load the minimal base employee record initially"
            // Let's make getOne return the Base record so the initial page load is fast.
            // OR keep getOne as full and make FE use explicit tab endpoints.
            // Comment 2 says: "update EmployeeDetailPage to load minimal base... then fetch tab data".
            // So getOne effectively becomes getBase or we keep getOne as is (backend doesn't break) and add new endpoints.
            // Let's add new endpoints and FE uses them.
            // If FE calls /employees/:id, let's return Base to be safe for "Lazy Loading" pattern recommendation, 
            // BUT existing code might rely on it. Let's create specific methods.

            const employee = await employeeService.getEmployeeWithDetails(id); // Keeping full fetch for regular getOne to avoid breaking other consumers
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
