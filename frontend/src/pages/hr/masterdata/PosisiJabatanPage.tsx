import React, { useState } from 'react';
import { usePosisiJabatanList, useDepartmentList, useCreateMasterData, useUpdateMasterData, useDeleteMasterData } from '../../../hooks/useMasterData';
import MasterDataTable, { Column } from '../../../components/hr/MasterDataTable';
import MasterDataForm from '../../../components/hr/MasterDataForm';
import Modal from '../../../components/common/Modal';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import SearchFilter from '../../../components/common/SearchFilter';
import { PosisiJabatan } from '../../../types/hr';

const PosisiJabatanPage: React.FC = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<PosisiJabatan | null>(null);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

    const { data, isLoading } = usePosisiJabatanList({ page, limit: 10, search, status });
    const { data: deptData } = useDepartmentList({ limit: 100, status: 'true' });

    const createMutation = useCreateMasterData('posisi-jabatan');
    const updateMutation = useUpdateMasterData('posisi-jabatan');
    const deleteMutation = useDeleteMasterData('posisi-jabatan');

    const columns: Column<PosisiJabatan>[] = [
        { header: 'No', accessor: (item) => item.id, className: 'w-16' },
        { header: 'Nama Posisi', accessor: 'nama' },
        {
            header: 'Department',
            accessor: (item: any) => item.department?.nama || '-'
        },
        { header: 'Status', accessor: 'status' },
    ];

    const formFields = [
        { name: 'nama', label: 'Nama Posisi', type: 'text' as const, required: true },
        {
            name: 'department_id',
            label: 'Department',
            type: 'select' as const,
            required: true,
            options: deptData?.data.map(d => ({ label: d.nama, value: d.id })) || []
        },
        { name: 'keterangan', label: 'Keterangan', type: 'textarea' as const },
        { name: 'status', label: 'Status', type: 'toggle' as const },
    ];

    const handleAdd = () => {
        setModalMode('create');
        setSelectedItem(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item: PosisiJabatan) => {
        setModalMode('edit');
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = (item: PosisiJabatan) => {
        setSelectedItem(item);
        setIsConfirmOpen(true);
    };

    const onFormSubmit = (formData: any) => {
        const payload = {
            ...formData,
            department_id: Number(formData.department_id)
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
                    <h1 className="text-2xl font-bold text-gray-900">Master Data Posisi Jabatan</h1>
                    <p className="text-sm text-gray-500 mt-1">Kelola data posisi dan jabatan karyawan</p>
                </div>
            </div>

            <SearchFilter
                onSearchChange={setSearch}
                onFilterChange={setStatus}
                onAdd={handleAdd}
                addButtonText="Tambah Posisi"
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
                title={modalMode === 'create' ? 'Tambah Posisi' : 'Edit Posisi'}
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
                title="Hapus Posisi"
                message="Apakah Anda yakin ingin menghapus posisi ini?"
                itemPreview={selectedItem ? { Nama: selectedItem.nama } : null}
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
};

export default PosisiJabatanPage;
