import React, { useState } from 'react';
import { useTagList, useCreateMasterData, useUpdateMasterData, useDeleteMasterData } from '../../../hooks/useMasterData';
import MasterDataTable, { Column } from '../../../components/hr/MasterDataTable';
import MasterDataForm from '../../../components/hr/MasterDataForm';
import Modal from '../../../components/common/Modal';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import SearchFilter from '../../../components/common/SearchFilter';
import { Tag } from '../../../types/hr';

const TagPage: React.FC = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Tag | null>(null);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

    const { data, isLoading } = useTagList({ page, limit: 10, search, status });
    const createMutation = useCreateMasterData('tag');
    const updateMutation = useUpdateMasterData('tag');
    const deleteMutation = useDeleteMasterData('tag');

    const columns: Column<Tag>[] = [
        { header: 'No', accessor: (item) => item.id, className: 'w-16' },
        { header: 'Nama Tag', accessor: 'nama' },
        {
            header: 'Warna',
            accessor: (item) => (
                <div className="flex items-center gap-2">
                    <div
                        className="w-6 h-6 rounded-full border border-gray-200"
                        style={{ backgroundColor: item.warna_tag || '#e5e7eb' }}
                    />
                    <span className="text-xs text-gray-500">{item.warna_tag}</span>
                </div>
            )
        },
        { header: 'Status', accessor: 'status' },
    ];

    const formFields = [
        { name: 'nama', label: 'Nama Tag', type: 'text' as const, required: true },
        { name: 'warna_tag', label: 'Warna Tag', type: 'color' as const },
        { name: 'keterangan', label: 'Keterangan', type: 'textarea' as const },
        { name: 'status', label: 'Status', type: 'toggle' as const },
    ];

    const handleAdd = () => {
        setModalMode('create');
        setSelectedItem(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item: Tag) => {
        setModalMode('edit');
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = (item: Tag) => {
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
                    <h1 className="text-2xl font-bold text-gray-900">Master Data Tag</h1>
                    <p className="text-sm text-gray-500 mt-1">Kelola data tag/label karyawan</p>
                </div>
            </div>

            <SearchFilter
                onSearchChange={setSearch}
                onFilterChange={setStatus}
                onAdd={handleAdd}
                addButtonText="Tambah Tag"
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
                title={modalMode === 'create' ? 'Tambah Tag' : 'Edit Tag'}
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
                title="Hapus Tag"
                message="Apakah Anda yakin ingin menghapus tag ini?"
                itemPreview={selectedItem ? { Nama: selectedItem.nama } : null}
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
};

export default TagPage;
