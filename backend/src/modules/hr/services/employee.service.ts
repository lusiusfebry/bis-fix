import Employee from '../models/Employee';

class EmployeeService {
    async getAllEmployees() {
        return await Employee.findAll();
    }

    async getEmployeeById(id: number) {
        return await Employee.findByPk(id);
    }

    async createEmployee(data: Partial<Employee>) {
        return await Employee.create(data);
    }

    async updateEmployee(id: number, data: Partial<Employee>) {
        const employee = await this.getEmployeeById(id);
        if (!employee) throw new Error('Employee not found');
        return await employee.update(data);
    }

    async deleteEmployee(id: number) {
        const employee = await this.getEmployeeById(id);
        if (!employee) throw new Error('Employee not found');
        return await employee.destroy();
    }
}

export default new EmployeeService();
