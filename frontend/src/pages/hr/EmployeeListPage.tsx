import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api/client';
import Button from '../../components/common/Button';
import EmployeeTable from '../../components/hr/EmployeeTable';
import { toast } from 'react-hot-toast';
import { useMasterDataList } from '../../hooks/useMasterData';
import { AdvancedEmployeeFilter } from '../../components/hr/AdvancedEmployeeFilter';
import { FilterChipsContainer } from '../../components/common/FilterChipsContainer';
import { ExportButton } from '../../components/hr/ExportButton';
import { EmployeeFilterParams, Divisi, Department, PosisiJabatan, StatusKaryawan, LokasiKerja, Tag } from '../../types/hr';

const EmployeeListPage = () => {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Advanced Filters State
    const [filters, setFilters] = useState<EmployeeFilterParams>({});

    const handleFilterChange = (newFilters: EmployeeFilterParams) => {
        setFilters(newFilters);
        setPage(1);
    };

    // Master Data for Chips Label Lookup
    const { data: divisiList } = useMasterDataList('divisi');
    const { data: deptList } = useMasterDataList('department');
    const { data: posisiList } = useMasterDataList('posisi_jabatan');
    const { data: statusList } = useMasterDataList('status_karyawan');
    const { data: lokasiList } = useMasterDataList('lokasi_kerja');
    const { data: tagList } = useMasterDataList('tag');

    // Debounce Search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchEmployees();
        }, 500);
        return () => clearTimeout(timeoutId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, filters, page]);

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const params = {
                search,
                ...filters,
                page,
                limit: 10
            };
            const response = await api.get('/hr/employees', { params });
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

    const handleResetFilters = () => {
        setFilters({});
        setPage(1);
    };

    const handleRemoveFilter = (key: string) => {
        const newFilters = { ...filters };
        delete newFilters[key as keyof EmployeeFilterParams];
        setFilters(newFilters);
        setPage(1);
    };

    // Prepare chips data
    const activeFiltersChips = useMemo(() => {
        const chips: Record<string, { label: string; value: string }> = {};
        if (filters.divisi_id) {
            const item = (divisiList?.data as Divisi[])?.find((d) => d.id === filters.divisi_id);
            chips.divisi_id = { label: 'Divisi', value: item?.nama || '...' };
        }
        if (filters.department_id) {
            const item = (deptList?.data as Department[])?.find((d) => d.id === filters.department_id);
            chips.department_id = { label: 'Department', value: item?.nama || '...' };
        }
        if (filters.posisi_jabatan_id) {
            const item = (posisiList?.data as PosisiJabatan[])?.find((d) => d.id === filters.posisi_jabatan_id);
            chips.posisi_jabatan_id = { label: 'Posisi', value: item?.nama || '...' };
        }
        if (filters.status_karyawan_id) {
            const item = (statusList?.data as StatusKaryawan[])?.find((d) => d.id === filters.status_karyawan_id);
            chips.status_karyawan_id = { label: 'Status', value: item?.nama || '...' };
        }
        if (filters.lokasi_kerja_id) {
            const item = (lokasiList?.data as LokasiKerja[])?.find((d) => d.id === filters.lokasi_kerja_id);
            chips.lokasi_kerja_id = { label: 'Lokasi', value: item?.nama || '...' };
        }
        if (filters.tag_id) {
            const item = (tagList?.data as Tag[])?.find((d) => d.id === filters.tag_id);
            chips.tag_id = { label: 'Tag', value: item?.nama || '...' };
        }
        return chips;
    }, [filters, divisiList, deptList, posisiList, statusList, lokasiList, tagList]);

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Manajemen Karyawan</h1>
                    <p className="text-gray-500 dark:text-gray-400">Kelola data karyawan, filter, dan export.</p>
                </div>
                <div className="flex gap-2">
                    <ExportButton filters={{ ...filters, search }} />
                    <Button onClick={() => navigate('/hr/import')} variant="secondary" className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[20px]">upload_file</span>
                        Import Excel
                    </Button>
                    <Button onClick={() => navigate('/hr/employees/create')} className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        Tambah Karyawan
                    </Button>
                </div>
            </div>

            {/* Search & Filter Section */}
            <div className="space-y-4">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700">
                    <div className="mb-4">
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

                    <AdvancedEmployeeFilter
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onReset={handleResetFilters}
                    />
                </div>

                <FilterChipsContainer
                    filters={activeFiltersChips}
                    onRemoveFilter={handleRemoveFilter}
                    onClearAll={handleResetFilters}
                />
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
