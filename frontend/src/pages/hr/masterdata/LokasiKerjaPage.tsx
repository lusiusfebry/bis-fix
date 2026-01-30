import React, { useState } from 'react';
import { useLokasiKerjaList, useCreateMasterData, useUpdateMasterData, useDeleteMasterData } from '../../../hooks/useMasterData';
import MasterDataTable, { Column } from '../../../components/hr/MasterDataTable';
import MasterDataForm from '../../../components/hr/MasterDataForm';
import Modal from '../../../components/common/Modal';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import SearchFilter from '../../../components/common/SearchFilter';
import { LokasiKerja } from '../../../types/hr';

const LokasiKerjaPage: React.FC = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<LokasiKerja | null>(null);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

    const { data, isLoading } = useLokasiKerjaList({ page, limit: 10, search, status });
    const createMutation = useCreateMasterData('lokasi-kerja');
    const updateMutation = useUpdateMasterData('lokasi-kerja');
    const deleteMutation = useDeleteMasterData('lokasi-kerja');

    const columns: Column<LokasiKerja>[] = [
        { header: 'No', accessor: (item) => item.id, className: 'w-16' },
        { header: 'Nama Lokasi', accessor: 'nama' },
        { header: 'Alamat', accessor: 'alamat' },
        { header: 'Status', accessor: 'status' },
    ];

    const formFields = [
        { name: 'nama', label: 'Nama Lokasi', type: 'text' as const, required: true },
        { name: 'alamat', label: 'Alamat', type: 'textarea' as const },
        { name: 'keterangan', label: 'Keterangan', type: 'textarea' as const },
        { name: 'status', label: 'Status', type: 'toggle' as const },
    ];

    const handleAdd = () => {
        setModalMode('create');
        setSelectedItem(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item: LokasiKerja) => {
        setModalMode('edit');
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = (item: LokasiKerja) => {
        setSelectedItem(item);
        setIsConfirmOpen(true);
    };

    const onFormSubmit = (formData: any) => {
        if (modalMode === 'create') {
            createMutation.mutate(formData, { onSuccess: () => setIsModalOpen(false) });
        } else {
            if (!selectedItem) return;
            updateMutation.mutate({ id: selectedItem.id, data: formData }, { onSuccess: () => setIsModalOpen(false) });
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
                    <h1 className="text-2xl font-bold text-gray-900">Master Data Lokasi Kerja</h1>
                    <p className="text-sm text-gray-500 mt-1">Kelola data lokasi kerja karyawan</p>
                </div>
            </div>

            <SearchFilter
                onSearchChange={setSearch}
                onFilterChange={setStatus}
                onAdd={handleAdd}
                addButtonText="Tambah Lokasi"
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
                title={modalMode === 'create' ? 'Tambah Lokasi' : 'Edit Lokasi'}
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
                title="Hapus Lokasi"
                message="Apakah Anda yakin ingin menghapus lokasi ini?"
                itemPreview={selectedItem ? { Nama: selectedItem.nama } : null}
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
};

export default LokasiKerjaPage;
