
import { EmployeeFilterParams } from '../../types/hr';
import apiClient from './client';

export const exportService = {
    exportEmployeesToExcel: async (filters: EmployeeFilterParams & { search?: string }) => {
        const response = await apiClient.get('/hr/employees/export/excel', {
            params: filters,
            responseType: 'blob'
        });
        return response.data;
    },

    exportEmployeeToPDF: async (employeeId: number) => {
        const response = await apiClient.get(`/hr/employees/${employeeId}/export/pdf`, {
            responseType: 'blob'
        });
        return response.data;
    },

    downloadFile: (blob: Blob, filename: string) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    }
};
