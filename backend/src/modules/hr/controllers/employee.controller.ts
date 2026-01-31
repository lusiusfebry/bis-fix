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
            const photoPath = req.file ? `/uploads/employees/photos/${req.file.filename}` : undefined;

            const isUnique = await employeeService.validateNIKUnique(employeeData.nomor_induk_karyawan);
            if (!isUnique) {
                return res.status(400).json({ message: 'NIK already exists' });
            }

            const employee = await employeeService.createEmployeeWithPersonalInfo(employeeData, personalInfoData, photoPath);
            res.status(201).json({ data: employee });
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const employeeData = req.body;
            const personalInfoData = req.body;
            const photoPath = req.file ? `/uploads/employees/photos/${req.file.filename}` : undefined;

            if (employeeData.nomor_induk_karyawan) {
                const isUnique = await employeeService.validateNIKUnique(employeeData.nomor_induk_karyawan, id);
                if (!isUnique) {
                    return res.status(400).json({ message: 'NIK already exists' });
                }
            }

            const employee = await employeeService.updateEmployeeWithPersonalInfo(id, employeeData, personalInfoData, photoPath);
            res.json({ data: employee });
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
}

export default new EmployeeController();
