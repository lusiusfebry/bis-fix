import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api/client';
import Button from '../../components/common/Button';
import EmployeeTable from '../../components/hr/EmployeeTable';
import { toast } from 'react-hot-toast';
import { useMasterDataList } from '../../hooks/useMasterData';

const EmployeeListPage = () => {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Filters
    const [selectedDivisi, setSelectedDivisi] = useState('');
    const [selectedDept, setSelectedDept] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    // Master Data for Filters
    const { data: divisiData } = useMasterDataList('divisi');
    const { data: deptData } = useMasterDataList('department');
    const { data: statusData } = useMasterDataList('status-karyawan');

    // Debounce Search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchEmployees();
        }, 500);
        return () => clearTimeout(timeoutId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, selectedDivisi, selectedDept, selectedStatus, page]);

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const params = {
                search,
                divisi_id: selectedDivisi,
                department_id: selectedDept,
                status_id: selectedStatus,
                page,
                limit: 10
            };
            const response = await api.get('/hr/employees', { params });
            // Backend returns: { data: rows, total, page, totalPages }
            setEmployees(response.data.data);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Failed to fetch employees:', error);
            toast.error('Gagal memuat data karyawan');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus data karyawan ini?')) return;

        try {
            await api.delete(`/hr/employees/${id}`);
            toast.success('Karyawan berhasil dihapus');
            fetchEmployees();
        } catch (error) {
            toast.error('Gagal menghapus karyawan');
        }
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Manajemen Karyawan</h1>
                    <p className="text-gray-500 dark:text-gray-400">Kelola data karyawan, posisi, dan status kepegawaian.</p>
                </div>
                <Button onClick={() => navigate('/hr/employees/create')} className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    Tambah Karyawan
                </Button>
            </div>

            {/* Filters Section */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700 space-y-4 md:space-y-0 md:flex md:gap-4 items-end">
                <div className="flex-1 w-full">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cari Karyawan</label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-gray-400">search</span>
                        </span>
                        <input
                            type="text"
                            placeholder="Cari nama atau NIK..."
                            className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 dark:bg-slate-900 dark:border-slate-700 focus:border-primary focus:ring-primary sm:text-sm p-2.5"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="w-full md:w-48">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Divisi</label>
                    <select
                        className="block w-full rounded-lg border-gray-300 bg-gray-50 dark:bg-slate-900 dark:border-slate-700 focus:border-primary focus:ring-primary sm:text-sm p-2.5"
                        value={selectedDivisi}
                        onChange={(e) => setSelectedDivisi(e.target.value)}
                    >
                        <option value="">Semua Divisi</option>
                        {divisiData?.data?.map((d) => (
                            <option key={d.id} value={d.id}>{d.nama}</option>
                        ))}
                    </select>
                </div>

                <div className="w-full md:w-48">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Departemen</label>
                    <select
                        className="block w-full rounded-lg border-gray-300 bg-gray-50 dark:bg-slate-900 dark:border-slate-700 focus:border-primary focus:ring-primary sm:text-sm p-2.5"
                        value={selectedDept}
                        onChange={(e) => setSelectedDept(e.target.value)}
                    >
                        <option value="">Semua Departemen</option>
                        {deptData?.data?.map((d) => (
                            <option key={d.id} value={d.id}>{d.nama}</option>
                        ))}
                    </select>
                </div>

                <div className="w-full md:w-48">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                    <select
                        className="block w-full rounded-lg border-gray-300 bg-gray-50 dark:bg-slate-900 dark:border-slate-700 focus:border-primary focus:ring-primary sm:text-sm p-2.5"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        <option value="">Semua Status</option>
                        {statusData?.data?.map((d) => (
                            <option key={d.id} value={d.id}>{d.nama}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Table */}
            <EmployeeTable
                employees={employees}
                isLoading={loading}
                onDelete={handleDelete}
            />

            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <div className="flex justify-center gap-2">
                    <Button
                        variant="secondary"
                        disabled={page === 1}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                    >
                        Previous
                    </Button>
                    <span className="flex items-center px-4 text-sm text-gray-600 font-medium">
                        Page {page} of {totalPages}
                    </span>
                    <Button
                        variant="secondary"
                        disabled={page >= totalPages}
                        onClick={() => setPage(p => p + 1)}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
};

export default EmployeeListPage;
