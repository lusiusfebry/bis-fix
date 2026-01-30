import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import DashboardPage from './pages/dashboard/DashboardPage';
import EmployeeListPage from './pages/hr/EmployeeListPage';
import LoginPage from './pages/auth/LoginPage';
import WelcomePage from './pages/WelcomePage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Welcome Page (Standalone Layout) */}
            <Route
                path="/welcome"
                element={
                    <ProtectedRoute>
                        <WelcomePage />
                    </ProtectedRoute>
                }
            />

            {/* Protected Module Routes (with MainLayout) */}
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <MainLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Navigate to="/welcome" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="hr">
                    <Route index element={<EmployeeListPage />} />
                    <Route path="employees" element={<EmployeeListPage />} />
                    <Route path="employees/:id" element={<div>Employee Detail Placeholder</div>} />
                </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}

export default App;
