import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useDivisiList, useCreateMasterData, useUpdateMasterData, useDeleteMasterData } from '../../../hooks/useMasterData';
import MasterDataTable, { Column } from '../../../components/hr/MasterDataTable';
import MasterDataForm from '../../../components/hr/MasterDataForm';
import Modal from '../../../components/common/Modal';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import SearchFilter from '../../../components/common/SearchFilter';
import { Divisi } from '../../../types/hr';
// Plan mentions "Toast notifications".
// I'll check package.json for toast lib. If not, I'll use a simple alert or console for now or add it.
// Checking package.json earlier -> NO toast lib.
// But "Integrasi dengan react-hook-form... Toast notifications".
// I'll assume I should install `react-hot-toast` or similar. I'll add the import but comment it out if not available, OR better: use a simple custom toast or just window.alert for now to strict to plan without extra installs if not critical. 
// Actually, I'll install `react-hot-toast` as it's standard.
// For now, I'll use console.log/alert to avoid build breakage if I don't install it yet.
// Re-reading user plan: "Toast notifications untuk success/error messages".
// I will use `alert` temporarily or check if context has toast.
// I will install `react-hot-toast` in background.

const DivisiPage: React.FC = () => {
    // State
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Divisi | null>(null);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

    // Hooks
    const { data, isLoading } = useDivisiList({ page, limit: 10, search, status });
    const createMutation = useCreateMasterData('divisi');
    const updateMutation = useUpdateMasterData('divisi');
    const deleteMutation = useDeleteMasterData('divisi');

    // Columns
    const columns: Column<Divisi>[] = [
        { header: 'No', accessor: (item) => item.id, className: 'w-16' }, // or row index
        { header: 'Nama Divisi', accessor: 'nama' },
        { header: 'Keterangan', accessor: 'keterangan' },
        {
            header: 'Jumlah Dept.',
            accessor: (item: Divisi) => (item as any).departments?.length || 0
        },
        { header: 'Status', accessor: 'status' }, // handled by Table Status badge
    ];

    // Form Fields
    const formFields = [
        { name: 'nama', label: 'Nama Divisi', type: 'text' as const, required: true, placeholder: 'Contoh: IT, HR, Finance' },
        { name: 'keterangan', label: 'Keterangan', type: 'textarea' as const, placeholder: 'Deskripsi singkat divisi' },
        { name: 'status', label: 'Status', type: 'toggle' as const },
    ];

    // Handlers
    const handleAdd = () => {
        setModalMode('create');
        setSelectedItem(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item: Divisi) => {
        setModalMode('edit');
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = (item: Divisi) => {
        setSelectedItem(item);
        setIsConfirmOpen(true);
    };

    const onFormSubmit = (formData: any) => {
        if (modalMode === 'create') {
            createMutation.mutate(formData, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    toast.success('Data berhasil disimpan');
                },
                onError: (err) => {
                    toast.error('Gagal menyimpan data');
                    console.error(err);
                }
            });
        } else {
            if (!selectedItem) return;
            updateMutation.mutate({ id: selectedItem.id, data: formData }, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    toast.success('Data berhasil diperbarui');
                },
                onError: (err) => {
                    toast.error('Gagal memperbarui data');
                    console.error(err);
                }
            });
        }
    };

    const onConfirmDelete = () => {
        if (!selectedItem) return;
        deleteMutation.mutate(selectedItem.id, {
            onSuccess: () => {
                setIsConfirmOpen(false);
            }
        });
    };

    return (
        <div className="p-6">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Master Data Divisi</h1>
                    <p className="text-sm text-gray-500 mt-1">Kelola data divisi perusahaan</p>
                </div>
            </div>

            <SearchFilter
                onSearchChange={setSearch}
                onFilterChange={setStatus}
                onAdd={handleAdd}
                addButtonText="Tambah Divisi"
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

            {/* Form Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalMode === 'create' ? 'Tambah Divisi' : 'Edit Divisi'}
            >
                <MasterDataForm
                    fields={formFields}
                    initialValues={selectedItem}
                    onSubmit={onFormSubmit}
                    onCancel={() => setIsModalOpen(false)}
                    isLoading={createMutation.isPending || updateMutation.isPending}
                />
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={isConfirmOpen}
                onCancel={() => setIsConfirmOpen(false)}
                onConfirm={onConfirmDelete}
                title="Hapus Divisi"
                message="Apakah Anda yakin ingin menghapus divisi ini? Data yang dihapus tidak dapat dikembalikan."
                itemPreview={selectedItem ? { Nama: selectedItem.nama } : null}
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
};

export default DivisiPage;
