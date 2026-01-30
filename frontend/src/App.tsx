import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import DashboardPage from './pages/dashboard/DashboardPage';
// import EmployeeListPage from './pages/hr/EmployeeListPage'; // Commenting out until implemented fully or error fixed if exists. But I just created it.
import EmployeeListPage from './pages/hr/EmployeeListPage';

function App() {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="hr">
                    <Route index element={<EmployeeListPage />} />
                    {/* <Route path="employees" element={<EmployeeListPage />} /> */}
                </Route>
            </Route>
        </Routes>
    );
}

export default App;
