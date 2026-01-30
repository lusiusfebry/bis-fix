import { Employee } from './hr';

export interface User {
    id: number;
    nik: string;
    role: 'superadmin' | 'admin' | 'staff' | 'employee';
    employee: Employee | null;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
    setLoading: (isLoading: boolean) => void;
    setUser: (user: User) => void;
}
