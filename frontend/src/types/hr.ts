export interface Employee {
    id: number;
    nik: string;
    name: string;
    position: string;
    department: string;
    email: string;
    phone?: string;
    joinDate?: string;
    photo?: string;
    createdAt: string;
    updatedAt: string;
}

export type CreateEmployeeInput = Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateEmployeeInput = Partial<CreateEmployeeInput>;
