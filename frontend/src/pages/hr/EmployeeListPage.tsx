import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api/client';
import Button from '../../components/common/Button';

interface Employee {
    id: number;
    nik: string;
    name: string;
    position: string;
    department: string;
}

const EmployeeListPage = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const response = await api.get('/hr/employees');
            setEmployees(response.data.data);
        } catch (error) {
            console.error('Failed to fetch employees:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Employee List</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage your organization's employees.</p>
                </div>
                <Button onClick={() => alert('Feature coming soon!')}>Add Employee</Button>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th className="px-6 py-3">NIK</th>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Position</th>
                                <th className="px-6 py-3">Department</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center">Loading...</td>
                                </tr>
                            ) : employees.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center">No employees found.</td>
                                </tr>
                            ) : (
                                employees.map((employee) => (
                                    <tr key={employee.id} className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{employee.nik}</td>
                                        <td className="px-6 py-4">{employee.name}</td>
                                        <td className="px-6 py-4">{employee.position}</td>
                                        <td className="px-6 py-4">{employee.department}</td>
                                        <td className="px-6 py-4">
                                            <Link to={`/hr/employees/${employee.id}`} className="font-medium text-blue-600 hover:underline dark:text-blue-500">Edit</Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EmployeeListPage;
