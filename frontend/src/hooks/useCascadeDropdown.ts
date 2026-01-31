import { useState, useEffect } from 'react';
import api from '../services/api/client';
import { Department, PosisiJabatan, Employee } from '../types/hr';

// Generic hook return type
interface UseListResult<T> {
    data: T[];
    isLoading: boolean;
    error: unknown;
}

export const useDepartmentByDivisi = (divisiId?: number): UseListResult<Department> => {
    const [data, setData] = useState<Department[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        if (!divisiId) {
            setData([]);
            return;
        }

        const fetchDepartments = async () => {
            setIsLoading(true);
            try {
                // Assuming new endpoint: /hr/departments/by-divisi/:divisiId
                const response = await api.get(`/hr/departments/by-divisi/${divisiId}`);
                setData(response.data.data);
            } catch (err) {
                setError(err);
                console.error('Failed to fetch departments by divisi', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDepartments();
    }, [divisiId]);

    return { data, isLoading, error };
};

export const usePosisiByDepartment = (departmentId?: number): UseListResult<PosisiJabatan> => {
    const [data, setData] = useState<PosisiJabatan[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        if (!departmentId) {
            setData([]);
            return;
        }

        const fetchPosisi = async () => {
            setIsLoading(true);
            try {
                const response = await api.get(`/hr/posisi-jabatan/by-department/${departmentId}`);
                setData(response.data.data);
            } catch (err) {
                setError(err);
                console.error('Failed to fetch posisi by department', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosisi();
    }, [departmentId]);

    return { data, isLoading, error };
};

export const useManagerList = (): UseListResult<Employee> => {
    const [data, setData] = useState<Employee[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        const fetchManagers = async () => {
            setIsLoading(true);
            try {
                const response = await api.get('/hr/validation/employees/managers');
                setData(response.data.data);
            } catch (err) {
                setError(err);
                console.error('Failed to fetch managers', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchManagers();
    }, []);

    return { data, isLoading, error };
};

export const useActiveEmployees = (): UseListResult<Employee> => {
    const [data, setData] = useState<Employee[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        const fetchEmployees = async () => {
            setIsLoading(true);
            try {
                const response = await api.get('/hr/validation/employees/active');
                setData(response.data.data);
            } catch (err) {
                setError(err);
                console.error('Failed to fetch active employees', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    return { data, isLoading, error };
};
