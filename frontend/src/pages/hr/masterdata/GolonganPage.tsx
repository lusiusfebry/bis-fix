import React, { useState } from 'react';
import { useGolonganList, useCreateMasterData, useUpdateMasterData, useDeleteMasterData } from '../../../hooks/useMasterData';
import MasterDataTable, { Column } from '../../../components/hr/MasterDataTable';
import MasterDataForm from '../../../components/hr/MasterDataForm';
import Modal from '../../../components/common/Modal';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import SearchFilter from '../../../components/common/SearchFilter';
import { Golongan } from '../../../types/hr';

const GolonganPage: React.FC = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Golongan | null>(null);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

    const { data, isLoading } = useGolonganList({ page, limit: 10, search, status });
    const createMutation = useCreateMasterData('golongan');
    const updateMutation = useUpdateMasterData('golongan');
    const deleteMutation = useDeleteMasterData('golongan');

    const columns: Column<Golongan>[] = [
        { header: 'No', accessor: (item) => item.id, className: 'w-16' },
        { header: 'Nama Golongan', accessor: 'nama' },
        { header: 'Keterangan', accessor: 'keterangan' },
        { header: 'Status', accessor: 'status' },
    ];

    const formFields = [
        { name: 'nama', label: 'Nama Golongan', type: 'text' as const, required: true },
        { name: 'keterangan', label: 'Keterangan', type: 'textarea' as const },
        { name: 'status', label: 'Status', type: 'toggle' as const },
    ];

    const handleAdd = () => { setModalMode('create'); setSelectedItem(null); setIsModalOpen(true); };
    const handleEdit = (item: Golongan) => { setModalMode('edit'); setSelectedItem(item); setIsModalOpen(true); };
    const handleDelete = (item: Golongan) => { setSelectedItem(item); setIsConfirmOpen(true); };
    const onFormSubmit = (formData: any) => {
        if (modalMode === 'create') createMutation.mutate(formData, { onSuccess: () => setIsModalOpen(false) });
        else if (selectedItem) updateMutation.mutate({ id: selectedItem.id, data: formData }, { onSuccess: () => setIsModalOpen(false) });
    };
    const onConfirmDelete = () => { if (selectedItem) deleteMutation.mutate(selectedItem.id, { onSuccess: () => setIsConfirmOpen(false) }); };

    return (
        <div className="p-6">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Master Data Golongan</h1>
                    <p className="text-sm text-gray-500 mt-1">Kelola data golongan karyawan</p>
                </div>
            </div>
            <SearchFilter onSearchChange={setSearch} onFilterChange={setStatus} onAdd={handleAdd} addButtonText="Tambah Golongan" />
            <MasterDataTable columns={columns} data={data?.data || []} isLoading={isLoading} pagination={{ page: data?.pagination?.page || 1, totalPages: data?.pagination?.totalPages || 1, total: data?.pagination?.total || 0, onPageChange: setPage }} onEdit={handleEdit} onDelete={handleDelete} />
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'create' ? 'Tambah Golongan' : 'Edit Golongan'}>
                <MasterDataForm fields={formFields} initialValues={selectedItem} onSubmit={onFormSubmit} onCancel={() => setIsModalOpen(false)} isLoading={createMutation.isPending || updateMutation.isPending} />
            </Modal>
            <ConfirmDialog isOpen={isConfirmOpen} onCancel={() => setIsConfirmOpen(false)} onConfirm={onConfirmDelete} title="Hapus Golongan" message="Apakah Anda yakin ingin menghapus data ini?" itemPreview={selectedItem ? { Nama: selectedItem.nama } : null} isLoading={deleteMutation.isPending} />
        </div>
    );
};

export default GolonganPage;
