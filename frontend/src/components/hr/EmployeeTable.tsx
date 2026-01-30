
import { Employee } from '../../types/hr';
import { formatDate } from '../../utils';
import { Link } from 'react-router-dom';

interface EmployeeTableProps {
    employees: Employee[];
    isLoading?: boolean;
}

const EmployeeTable = ({ employees, isLoading }: EmployeeTableProps) => {
    if (isLoading) {
        return <div className="p-4 text-center">Loading employees...</div>;
    }

    if (!employees.length) {
        return <div className="p-4 text-center text-gray-500">No employees found.</div>;
    }

    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm dark:border-gray-700">
            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th className="px-6 py-3">NIK</th>
                        <th className="px-6 py-3">Name</th>
                        <th className="px-6 py-3">Position</th>
                        <th className="px-6 py-3">Department</th>
                        <th className="px-6 py-3">Join Date</th>
                        <th className="px-6 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((employee) => (
                        <tr key={employee.id} className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600">
                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{employee.nik}</td>
                            <td className="px-6 py-4">{employee.name}</td>
                            <td className="px-6 py-4">{employee.position}</td>
                            <td className="px-6 py-4">{employee.department}</td>
                            <td className="px-6 py-4">{formatDate(employee.joinDate)}</td>
                            <td className="px-6 py-4">
                                <Link to={`/hr/employees/${employee.id}`} className="font-medium text-blue-600 hover:underline dark:text-blue-500">
                                    Edit
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EmployeeTable;
