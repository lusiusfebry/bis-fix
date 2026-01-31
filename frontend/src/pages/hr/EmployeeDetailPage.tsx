import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { employeeService } from '../../services/api/employee.service';
import toast from 'react-hot-toast';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import Button from '../../components/common/Button';
import { UserCircleIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { Employee } from '../../types/hr';
import { EmployeeFamilyInfoView } from '../../components/hr/EmployeeFamilyInfoView';
import { EmployeeHRInfoView } from '../../components/hr/EmployeeHRInfoView';
import { EmployeeQRCode } from '../../components/hr/EmployeeQRCode';

const EmployeeDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [loading, setLoading] = useState(true);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [activeTab, setActiveTab] = useState('personal');

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                if (!id) return;
                const data = await employeeService.getEmployee(parseInt(id));
                setEmployee(data as Employee);
            } catch (error) {
                console.error('Failed to fetch employee:', error);
                toast.error('Gagal memuat data karyawan');
            } finally {
                setLoading(false);
            }
        };
        fetchEmployee();
    }, [id]);

    const handleDelete = async () => {
        try {
            if (!id) return;
            await employeeService.deleteEmployee(parseInt(id));
            toast.success('Karyawan berhasil dihapus');
            navigate('/hr/employees');
        } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            toast.error(error.response?.data?.message || 'Gagal menghapus karyawan');
        }
    };

    if (loading) return <LoadingSkeleton />;
    if (!employee) return <div>Employee not found</div>;

    const tabs = [
        { id: 'personal', label: 'Personal Information' },
        { id: 'hr', label: 'Informasi HR' },
        { id: 'family', label: 'Informasi Keluarga' }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
                <div className="px-6 py-5 sm:flex sm:items-start sm:justify-between">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-20 w-20 relative">
                            {employee.foto_karyawan ? (
                                <img
                                    className="h-20 w-20 rounded-full object-cover border-2 border-white shadow-sm"
                                    src={`http://localhost:3000${employee.foto_karyawan}`}
                                    alt={employee.nama_lengkap}
                                />
                            ) : (
                                <UserCircleIcon className="h-20 w-20 text-gray-400" />
                            )}
                        </div>
                        <div className="ml-5">
                            <h1 className="text-2xl font-bold text-gray-900">{employee.nama_lengkap}</h1>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                                <span className="mr-3">{employee.nomor_induk_karyawan}</span>
                                <span className="mx-2">•</span>
                                <span>{employee.posisi_jabatan?.nama || '-'}</span>
                                <span className="mx-2">•</span>
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${employee.status_karyawan?.nama === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    {employee.status_karyawan?.nama || 'Unknown'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Desktop QR Code */}
                    <div className="hidden sm:flex ml-auto mr-4">
                        {employee.nomor_induk_karyawan && (
                            <div className="scale-75 origin-top-right">
                                <EmployeeQRCode
                                    nik={employee.nomor_induk_karyawan}
                                    employeeName={employee.nama_lengkap}
                                    showDownload={true}
                                    showPrint={true}
                                />
                            </div>
                        )}
                    </div>

                    <div className="mt-5 flex space-x-3 sm:mt-0">
                        <Button variant="outline" onClick={() => navigate(`/hr/employees/${id}/edit`)}>
                            <PencilIcon className="h-4 w-4 mr-2" />
                            Edit
                        </Button>
                        <Button variant="danger" onClick={() => setShowDeleteConfirm(true)}>
                            <TrashIcon className="h-4 w-4 mr-2" />
                            Hapus
                        </Button>
                    </div>
                </div>

                {/* Mobile QR Code */}
                <div className="sm:hidden px-6 pb-5 flex justify-center">
                    {employee.nomor_induk_karyawan && (
                        <EmployeeQRCode
                            nik={employee.nomor_induk_karyawan}
                            employeeName={employee.nama_lengkap}
                            showDownload={true}
                            showPrint={true}
                        />
                    )}
                </div>
            </div>

            {/* Tabs & Content */}
            <div className="bg-white shadow rounded-lg min-h-[400px]">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex px-6 space-x-8" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`${activeTab === tab.id
                                    ? 'border-primary-500 text-primary-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-6">
                    {activeTab === 'personal' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <DetailItem label="Tempat, Tanggal Lahir" value={`${employee.personal_info?.tempat_lahir || '-'}, ${employee.personal_info?.tanggal_lahir || '-'}`} />
                            <DetailItem label="Jenis Kelamin" value={employee.personal_info?.jenis_kelamin || '-'} />
                            <DetailItem label="Agama" value={employee.personal_info?.agama || '-'} />
                            <DetailItem label="Status Pernikahan" value={employee.personal_info?.status_pernikahan || '-'} />
                            <DetailItem label="Email Pribadi" value={employee.personal_info?.email_pribadi || '-'} />
                            <DetailItem label="No. Handphone" value={employee.nomor_handphone || '-'} />
                            <DetailItem label="Alamat Domisili" value={employee.personal_info?.alamat_domisili || '-'} fullWidth />
                            <DetailItem label="Divisi" value={employee.divisi?.nama || '-'} />
                            <DetailItem label="Departemen" value={employee.department?.nama || '-'} />
                        </div>
                    )}

                    {activeTab === 'hr' && (
                        <EmployeeHRInfoView employee={employee} />
                    )}
                    {activeTab === 'family' && (
                        <EmployeeFamilyInfoView employee={employee} />
                    )}
                </div>
            </div>

            <ConfirmDialog
                isOpen={showDeleteConfirm}
                title="Hapus Karyawan"
                message={`Apakah Anda yakin ingin menghapus karyawan ${employee.nama_lengkap}? Tindakan ini tidak dapat dibatalkan.`}
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteConfirm(false)}
            />
        </div>
    );
};

const DetailItem: React.FC<{ label: string; value: string; fullWidth?: boolean }> = ({ label, value, fullWidth }) => (
    <div className={`${fullWidth ? 'col-span-full' : 'col-span-1'}`}>
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900">{value}</dd>
    </div>
);

export default EmployeeDetailPage;
