import React from 'react';
import { Employee } from '../../types/hr';
import {
    BriefcaseIcon,
    DocumentTextIcon,
    AcademicCapIcon,
    StarIcon,
    PhoneIcon,
    MapPinIcon,
    TagIcon,
    ArrowsRightLeftIcon,
    BanknotesIcon
} from '@heroicons/react/24/outline';

const SectionHeader: React.FC<{ title: string; icon: React.ReactNode }> = ({ title, icon }) => (
    <h4 className="flex items-center text-lg font-medium text-gray-900 mb-4 border-b pb-2">
        <span className="mr-2 text-primary-600">{icon}</span>
        {title}
    </h4>
);

const DetailItem: React.FC<{ label: string; value: string | number | undefined | null }> = ({ label, value }) => (
    <div className="col-span-1">
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900">{value ? value : '-'}</dd>
    </div>
);

// Helper to format date
const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    // Handle YYYY-MM-DD
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

interface EmployeeHRInfoViewProps {
    employee: Employee;
}

export const EmployeeHRInfoView: React.FC<EmployeeHRInfoViewProps> = ({ employee }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hrInfo = (employee as any).hr_info || {};

    return (
        <div className="space-y-8">
            {/* Section 1: Kepegawaian (From Head mainly) */}
            <div className="bg-white border rounded-lg p-6 shadow-sm">
                <SectionHeader title="Kepegawaian" icon={<BriefcaseIcon className="w-5 h-5" />} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <DetailItem label="NIK" value={employee.nomor_induk_karyawan} />
                    <DetailItem label="Email Perusahaan" value={employee.email_perusahaan} />
                    <DetailItem label="Divisi" value={employee.divisi?.nama} />
                    <DetailItem label="Departemen" value={employee.department?.nama} />
                    <DetailItem label="Posisi" value={employee.posisi_jabatan?.nama} />
                    {/* Assuming Manager/Atasan names are available or populated via ID if needed. For now showing ID relation if name not preloaded. 
                        Ideally backend populates 'manager' relation object.
                    */}
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    <DetailItem label="Manager" value={(employee as any).manager?.nama_lengkap || '-'} />
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    <DetailItem label="Atasan Langsung" value={(employee as any).atasan_langsung?.nama_lengkap || '-'} />
                </div>
            </div>

            {/* Section 2: Kontrak */}
            <div className="bg-white border rounded-lg p-6 shadow-sm">
                <SectionHeader title="Kontrak & Tanggal" icon={<DocumentTextIcon className="w-5 h-5" />} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <DetailItem label="Jenis Hubungan Kerja" value={hrInfo.jenis_hubungan_kerja?.nama} />
                    <DetailItem label="Tgl Masuk Group" value={formatDate(hrInfo.tanggal_masuk_group)} />
                    <DetailItem label="Tgl Masuk" value={formatDate(hrInfo.tanggal_masuk)} />
                    <DetailItem label="Tgl Permanent" value={formatDate(hrInfo.tanggal_permanent)} />
                    <DetailItem label="Tgl Kontrak" value={formatDate(hrInfo.tanggal_kontrak)} />
                    <DetailItem label="Tgl Akhir Kontrak" value={formatDate(hrInfo.tanggal_akhir_kontrak)} />
                    <DetailItem label="Tgl Berhenti" value={formatDate(hrInfo.tanggal_berhenti)} />
                </div>
            </div>

            {/* Section 3: Education */}
            <div className="bg-white border rounded-lg p-6 shadow-sm">
                <SectionHeader title="Pendidikan" icon={<AcademicCapIcon className="w-5 h-5" />} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <DetailItem label="Tingkat Pendidikan" value={hrInfo.tingkat_pendidikan} />
                    <DetailItem label="Bidang Studi" value={hrInfo.bidang_studi} />
                    <DetailItem label="Nama Sekolah" value={hrInfo.nama_sekolah} />
                    <DetailItem label="Kota Sekolah" value={hrInfo.kota_sekolah} />
                    <DetailItem label="Status Kelulusan" value={hrInfo.status_kelulusan} />
                    <div className="col-span-full">
                        <dt className="text-sm font-medium text-gray-500">Keterangan Pendidikan</dt>
                        <dd className="mt-1 text-sm text-gray-900">{hrInfo.keterangan_pendidikan || '-'}</dd>
                    </div>
                </div>
            </div>

            {/* Section 4: Pangkat */}
            <div className="bg-white border rounded-lg p-6 shadow-sm">
                <SectionHeader title="Pangkat & Golongan" icon={<StarIcon className="w-5 h-5" />} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <DetailItem label="Kategori Pangkat" value={hrInfo.kategori_pangkat?.nama} />
                    <DetailItem label="Golongan" value={hrInfo.golongan?.nama} />
                    <DetailItem label="Sub Golongan" value={hrInfo.sub_golongan?.nama} />
                    <DetailItem label="No. Dana Pensiun" value={hrInfo.no_dana_pensiun} />
                </div>
            </div>

            {/* Section 5: Kontak Darurat */}
            <div className="bg-white border rounded-lg p-6 shadow-sm">
                <SectionHeader title="Kontak Darurat" icon={<PhoneIcon className="w-5 h-5" />} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* KD 1 */}
                    <div className="bg-gray-50 p-4 rounded-md">
                        <h5 className="font-semibold text-gray-700 border-b pb-2 mb-3">Kontak 1</h5>
                        <div className="space-y-3">
                            <DetailItem label="Nama" value={hrInfo.nama_kontak_darurat_1} />
                            <DetailItem label="Telepon" value={hrInfo.nomor_telepon_kontak_darurat_1} />
                            <DetailItem label="Hubungan" value={hrInfo.hubungan_kontak_darurat_1} />
                            <DetailItem label="Alamat" value={hrInfo.alamat_kontak_darurat_1} />
                        </div>
                    </div>
                    {/* KD 2 */}
                    <div className="bg-gray-50 p-4 rounded-md">
                        <h5 className="font-semibold text-gray-700 border-b pb-2 mb-3">Kontak 2</h5>
                        <div className="space-y-3">
                            <DetailItem label="Nama" value={hrInfo.nama_kontak_darurat_2} />
                            <DetailItem label="Telepon" value={hrInfo.nomor_telepon_kontak_darurat_2} />
                            <DetailItem label="Hubungan" value={hrInfo.hubungan_kontak_darurat_2} />
                            <DetailItem label="Alamat" value={hrInfo.alamat_kontak_darurat_2} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 6: POO/POH */}
            <div className="bg-white border rounded-lg p-6 shadow-sm">
                <SectionHeader title="Point of Origin / Hire" icon={<MapPinIcon className="w-5 h-5" />} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <DetailItem label="Point of Origin" value={hrInfo.point_of_original} />
                    <DetailItem label="Point of Hire" value={hrInfo.point_of_hire} />
                </div>
            </div>

            {/* Section 7: Seragam */}
            <div className="bg-white border rounded-lg p-6 shadow-sm">
                <SectionHeader title="Seragam & Sepatu" icon={<TagIcon className="w-5 h-5" />} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <DetailItem label="Ukuran Seragam" value={hrInfo.ukuran_seragam_kerja} />
                    <DetailItem label="Ukuran Sepatu" value={hrInfo.ukuran_sepatu_kerja} />
                </div>
            </div>

            {/* Section 8: Pergerakan */}
            <div className="bg-white border rounded-lg p-6 shadow-sm">
                <SectionHeader title="Pergerakan Karyawan" icon={<ArrowsRightLeftIcon className="w-5 h-5" />} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <DetailItem label="Lokasi Sebelumnya" value={hrInfo.lokasi_sebelumnya?.nama} />
                    <DetailItem label="Tgl Mutasi" value={formatDate(hrInfo.tanggal_mutasi)} />
                </div>
            </div>

            {/* Section 9: Costing */}
            <div className="bg-white border rounded-lg p-6 shadow-sm">
                <SectionHeader title="Costing" icon={<BanknotesIcon className="w-5 h-5" />} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <DetailItem label="Siklus Gaji" value={hrInfo.siklus_pembayaran_gaji} />
                    <DetailItem label="Costing" value={hrInfo.costing} />
                    <DetailItem label="Assign" value={hrInfo.assign} />
                    <DetailItem label="Actual" value={hrInfo.actual} />
                </div>
            </div>

        </div>
    );
};
