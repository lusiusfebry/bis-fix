import React from 'react';
import { Employee, EmployeeFamilyInfo } from '../../types/hr';
import { HeartIcon, UsersIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

interface EmployeeFamilyInfoViewProps {
    employee: Employee;
}

const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
        return format(new Date(dateString), 'd MMMM yyyy', { locale: localeId });
    } catch {
        return dateString;
    }
};

const SectionHeader: React.FC<{ title: string; icon: React.ReactNode }> = ({ title, icon }) => (
    <h4 className="flex items-center text-lg font-medium text-gray-900 mb-4 border-b pb-2">
        <span className="mr-2 text-primary-600">{icon}</span>
        {title}
    </h4>
);

const DetailItem: React.FC<{ label: string; value: string | number | undefined }> = ({ label, value }) => (
    <div className="col-span-1">
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900">{value !== undefined && value !== null && value !== '' ? value : '-'}</dd>
    </div>
);

const FullWidthDetailItem: React.FC<{ label: string; value: string | undefined }> = ({ label, value }) => (
    <div className="col-span-full">
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900">{value || '-'}</dd>
    </div>
);

export const EmployeeFamilyInfoView: React.FC<EmployeeFamilyInfoViewProps> = ({ employee }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const familyInfo = (employee as any).family_info as EmployeeFamilyInfo || {};
    // Parse JSONB fields if they come as string (from direct DB access without proper Model getter)
    // Though Sequelize usually handles this.
    const anakList = familyInfo.data_anak || [];
    const saudaraList = familyInfo.data_saudara_kandung || [];

    return (
        <div className="space-y-8">
            {/* Pasangan */}
            <div className="bg-white border rounded-lg p-6 shadow-sm">
                <SectionHeader title="Pasangan (Istri / Suami)" icon={<HeartIcon className="w-5 h-5" />} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <DetailItem label="Nama Pasangan" value={employee.personal_info?.nama_pasangan} />
                    <DetailItem label="Tanggal Lahir" value={formatDate(familyInfo.tanggal_lahir_pasangan)} />
                    <DetailItem label="Pendidikan Terakhir" value={familyInfo.pendidikan_terakhir_pasangan} />
                    <DetailItem label="Pekerjaan" value={employee.personal_info?.pekerjaan_pasangan} />
                    <DetailItem label="Jumlah Anak (KK)" value={employee.personal_info?.jumlah_anak} />
                    <FullWidthDetailItem label="Keterangan" value={familyInfo.keterangan_pasangan} />
                </div>
            </div>

            {/* Data Anak */}
            <div className="bg-white border rounded-lg p-6 shadow-sm">
                <SectionHeader title={`Data Anak (${anakList.length})`} icon={<UsersIcon className="w-5 h-5" />} />
                {anakList.length > 0 ? (
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">No</th>
                                    <th scope="col" className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">Nama</th>
                                    <th scope="col" className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">Jenis Kelamin</th>
                                    <th scope="col" className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">Tanggal Lahir</th>
                                    <th scope="col" className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">Keterangan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {anakList.map((anak, idx) => (
                                    <tr key={idx}>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{idx + 1}</td>
                                        <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">{anak.nama}</td>
                                        <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">{anak.jenis_kelamin}</td>
                                        <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">{formatDate(anak.tanggal_lahir)}</td>
                                        <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">{anak.keterangan || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm italic">Tidak ada data anak.</p>
                )}
            </div>

            {/* Orang Tua & Mertua */}
            <div className="bg-white border rounded-lg p-6 shadow-sm">
                <SectionHeader title="Orang Tua & Mertua" icon={<UsersIcon className="w-5 h-5" />} />

                <div className="mb-6">
                    <h5 className="font-medium text-gray-700 mb-3 bg-gray-50 p-2 rounded inline-block">Orang Tua Kandung</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <DetailItem label="Nama Ayah" value={familyInfo.nama_ayah_kandung} />
                        <DetailItem label="Nama Ibu" value={familyInfo.nama_ibu_kandung} />
                        <FullWidthDetailItem label="Alamat Orang Tua" value={familyInfo.alamat_orang_tua} />
                    </div>
                </div>

                <hr className="my-6 border-gray-100" />

                <div>
                    <h5 className="font-medium text-gray-700 mb-3 bg-gray-50 p-2 rounded inline-block">Mertua</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Ayah Mertua */}
                        <div className="space-y-4">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Ayah Mertua</p>
                            <div className="grid grid-cols-1 gap-4">
                                <DetailItem label="Nama" value={familyInfo.nama_ayah_mertua} />
                                <DetailItem label="Tgl Lahir" value={formatDate(familyInfo.tanggal_lahir_ayah_mertua)} />
                                <DetailItem label="Pendidikan" value={familyInfo.pendidikan_terakhir_ayah_mertua} />
                                <DetailItem label="Keterangan" value={familyInfo.keterangan_ayah_mertua} />
                            </div>
                        </div>
                        {/* Ibu Mertua */}
                        <div className="space-y-4 border-l pl-0 md:pl-8 border-gray-100">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Ibu Mertua</p>
                            <div className="grid grid-cols-1 gap-4">
                                <DetailItem label="Nama" value={familyInfo.nama_ibu_mertua} />
                                <DetailItem label="Tgl Lahir" value={formatDate(familyInfo.tanggal_lahir_ibu_mertua)} />
                                <DetailItem label="Pendidikan" value={familyInfo.pendidikan_terakhir_ibu_mertua} />
                                <DetailItem label="Keterangan" value={familyInfo.keterangan_ibu_mertua} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Saudara Kandung */}
            <div className="bg-white border rounded-lg p-6 shadow-sm">
                <SectionHeader title="Saudara Kandung" icon={<UserGroupIcon className="w-5 h-5" />} />
                <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DetailItem label="Anak Ke-" value={familyInfo.anak_ke} />
                    <DetailItem label="Jumlah Saudara" value={familyInfo.jumlah_saudara_kandung} />
                </div>

                {saudaraList.length > 0 ? (
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">No</th>
                                    <th scope="col" className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">Nama</th>
                                    <th scope="col" className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">L/P</th>
                                    <th scope="col" className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">Tanggal Lahir</th>
                                    <th scope="col" className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">Pendidikan</th>
                                    <th scope="col" className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">Pekerjaan</th>
                                    <th scope="col" className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">Keterangan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {saudaraList.map((saudara, idx) => (
                                    <tr key={idx}>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{idx + 1}</td>
                                        <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">{saudara.nama}</td>
                                        <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">{saudara.jenis_kelamin === 'Laki-laki' ? 'L' : 'P'}</td>
                                        <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">{formatDate(saudara.tanggal_lahir)}</td>
                                        <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">{saudara.pendidikan_terakhir || '-'}</td>
                                        <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">{saudara.pekerjaan || '-'}</td>
                                        <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">{saudara.keterangan || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm italic">Tidak ada data saudara kandung.</p>
                )}
            </div>
        </div>
    );
};
