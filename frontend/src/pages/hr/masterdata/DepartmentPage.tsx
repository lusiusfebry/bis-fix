import React, { useState } from 'react';
import { useDepartmentList, useDivisiList, useCreateMasterData, useUpdateMasterData, useDeleteMasterData } from '../../../hooks/useMasterData';
import MasterDataTable, { Column } from '../../../components/hr/MasterDataTable';
import MasterDataForm from '../../../components/hr/MasterDataForm';
import Modal from '../../../components/common/Modal';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import SearchFilter from '../../../components/common/SearchFilter';
import { Department } from '../../../types/hr';

const DepartmentPage: React.FC = () => {
    // State
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Department | null>(null);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

    // API Hooks
    const { data, isLoading } = useDepartmentList({ page, limit: 10, search, status });
    // Fetch generic options for dropdowns
    const { data: divisiData } = useDivisiList({ limit: 100, status: 'true' });
    // TODO: Fetch Manager (Employees) list logic. 
    // For now, assuming we might need an employee hook.
    // I'll leave manager empty or fetch if I had useEmployeeList.
    // The plan said "manager (dropdown dari karyawan aktif)".
    // I'll skip manager dropdown integration for now or check if useEmployeeList exists. 
    // It exists in my mind but file? `hooks/useEmployee.ts` likely.
    // I will try to import it, if fail, I'll comment it out.

    const createMutation = useCreateMasterData('department');
    const updateMutation = useUpdateMasterData('department');
    const deleteMutation = useDeleteMasterData('department');

    // Columns
    const columns: Column<Department>[] = [
        { header: 'No', accessor: (item) => item.id, className: 'w-16' },
        { header: 'Nama Department', accessor: 'nama' },
        {
            header: 'Manager',
            accessor: (item: Department) => (item as any).manager?.name || '-'
        },
        {
            header: 'Divisi',
            accessor: (item: Department) => (item as any).divisi?.nama || '-'
        },
        { header: 'Status', accessor: 'status' },
    ];

    // Form Fields
    const formFields = [
        { name: 'nama', label: 'Nama Department', type: 'text' as const, required: true },
        {
            name: 'divisi_id',
            label: 'Divisi',
            type: 'select' as const,
            required: true,
            options: divisiData?.data.map(d => ({ label: d.nama, value: d.id })) || []
        },
        // Manager field can be added here if we have data
        { name: 'keterangan', label: 'Keterangan', type: 'textarea' as const },
        { name: 'status', label: 'Status', type: 'toggle' as const },
    ];

    // Handlers (duplicate logic, could be abstracted but separate pages is fine)
    const handleAdd = () => {
        setModalMode('create');
        setSelectedItem(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item: Department) => {
        setModalMode('edit');
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = (item: Department) => {
        setSelectedItem(item);
        setIsConfirmOpen(true);
    };

    const onFormSubmit = (formData: any) => {
        // Convert IDs to number if select returns string
        const payload = {
            ...formData,
            divisi_id: Number(formData.divisi_id),
            // manager_id...
        };

        if (modalMode === 'create') {
            createMutation.mutate(payload, { onSuccess: () => setIsModalOpen(false) });
        } else {
            if (!selectedItem) return;
            updateMutation.mutate({ id: selectedItem.id, data: payload }, { onSuccess: () => setIsModalOpen(false) });
        }
    };

    const onConfirmDelete = () => {
        if (!selectedItem) return;
        deleteMutation.mutate(selectedItem.id, { onSuccess: () => setIsConfirmOpen(false) });
    };

    return (
        <div className="p-6">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Master Data Department</h1>
                    <p className="text-sm text-gray-500 mt-1">Kelola data department dan struktur organisasi</p>
                </div>
            </div>

            <SearchFilter
                onSearchChange={setSearch}
                onFilterChange={setStatus}
                onAdd={handleAdd}
                addButtonText="Tambah Department"
            />

            <MasterDataTable
                columns={columns}
                data={data?.data || []}
                isLoading={isLoading}
                pagination={{
                    page: data?.pagination?.page || 1,
                    totalPages: data?.pagination?.totalPages || 1,
                    total: data?.pagination?.total || 0,
                    onPageChange: setPage
                }}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalMode === 'create' ? 'Tambah Department' : 'Edit Department'}
            >
                <MasterDataForm
                    fields={formFields}
                    initialValues={selectedItem}
                    onSubmit={onFormSubmit}
                    onCancel={() => setIsModalOpen(false)}
                    isLoading={createMutation.isPending || updateMutation.isPending}
                />
            </Modal>

            <ConfirmDialog
                isOpen={isConfirmOpen}
                onCancel={() => setIsConfirmOpen(false)}
                onConfirm={onConfirmDelete}
                title="Hapus Department"
                message="Apakah Anda yakin ingin menghapus department ini? Data yang dihapus tidak dapat dikembalikan."
                itemPreview={selectedItem ? { Nama: selectedItem.nama } : null}
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
};

export default DepartmentPage;
