import { Request, Response, NextFunction } from 'express';
import employeeService from '../services/employee.service';

class EmployeeController {
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const employees = await employeeService.getAllEmployees();
            res.json({ data: employees });
        } catch (error) {
            next(error);
        }
    }

    async getOne(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const employee = await employeeService.getEmployeeById(id);
            if (!employee) return res.status(404).json({ message: 'Employee not found' });
            res.json({ data: employee });
        } catch (error) {
            next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const employee = await employeeService.createEmployee(req.body);
            res.status(201).json({ data: employee });
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const employee = await employeeService.updateEmployee(id, req.body);
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
