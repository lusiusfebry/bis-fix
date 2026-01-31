import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import DashboardPage from './pages/dashboard/DashboardPage';
import EmployeeListPage from './pages/hr/EmployeeListPage';
import EmployeeCreatePage from './pages/hr/EmployeeCreatePage';
import EmployeeEditPage from './pages/hr/EmployeeEditPage';
import EmployeeDetailPage from './pages/hr/EmployeeDetailPage';
import LoginPage from './pages/auth/LoginPage';
import WelcomePage from './pages/WelcomePage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import DivisiPage from './pages/hr/masterdata/DivisiPage';
import DepartmentPage from './pages/hr/masterdata/DepartmentPage';
import PosisiJabatanPage from './pages/hr/masterdata/PosisiJabatanPage';
import KategoriPangkatPage from './pages/hr/masterdata/KategoriPangkatPage';
import GolonganPage from './pages/hr/masterdata/GolonganPage';
import SubGolonganPage from './pages/hr/masterdata/SubGolonganPage';
import JenisHubunganKerjaPage from './pages/hr/masterdata/JenisHubunganKerjaPage';
import TagPage from './pages/hr/masterdata/TagPage';
import LokasiKerjaPage from './pages/hr/masterdata/LokasiKerjaPage';
import StatusKaryawanPage from './pages/hr/masterdata/StatusKaryawanPage';

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
                    <Route path="employees/create" element={<EmployeeCreatePage />} />
                    <Route path="employees/:id" element={<EmployeeDetailPage />} />
                    <Route path="employees/:id/edit" element={<EmployeeEditPage />} />

                    {/* Master Data Routes */}
                    <Route path="master-data">
                        <Route path="divisi" element={<DivisiPage />} />
                        <Route path="department" element={<DepartmentPage />} />
                        <Route path="posisi-jabatan" element={<PosisiJabatanPage />} />
                        <Route path="kategori-pangkat" element={<KategoriPangkatPage />} />
                        <Route path="golongan" element={<GolonganPage />} />
                        <Route path="sub-golongan" element={<SubGolonganPage />} />
                        <Route path="jenis-hubungan-kerja" element={<JenisHubunganKerjaPage />} />
                        <Route path="tag" element={<TagPage />} />
                        <Route path="lokasi-kerja" element={<LokasiKerjaPage />} />
                        <Route path="status-karyawan" element={<StatusKaryawanPage />} />
                    </Route>
                </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}

export default App;
