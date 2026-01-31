import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { employeeStep2Schema, EmployeeStep2FormValues } from '../../schemas/employee.schema';
import Input from '../common/Input';
import { SearchableSelect } from '../common/SearchableSelect';
import Button from '../common/Button';
import {
    useJenisHubunganKerjaList,
    useKategoriPangkatList,
    useGolonganList,
    useSubGolonganList,
    useLokasiKerjaList,
    // useEmployeeList 
} from '../../hooks/useMasterData';
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

import { DocumentUpload } from './DocumentUpload';

interface EmployeeStep2FormProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialData?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    headData?: any;
    employeeId?: number;
    onNext: (data: EmployeeStep2FormValues) => void;
    onBack: () => void;
}

export const EmployeeStep2Form: React.FC<EmployeeStep2FormProps> = ({ initialData, headData, employeeId, onNext, onBack }) => {
    const {
        register,
        control,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm<EmployeeStep2FormValues>({
        resolver: zodResolver(employeeStep2Schema),
        defaultValues: {
            ...initialData,
            // Pre-populate read-only fields from headData if available
            nomor_induk_karyawan: headData?.nomor_induk_karyawan,
            posisi_jabatan_id: headData?.posisi_jabatan_id,
            divisi_id: headData?.divisi_id,
            department_id: headData?.department_id,
            email_perusahaan: headData?.email_perusahaan,
            manager_id: headData?.manager_id,
            atasan_langsung_id: headData?.atasan_langsung_id,
        }
    });

    useEffect(() => {
        if (headData) {
            setValue('nomor_induk_karyawan', headData.nomor_induk_karyawan);
            setValue('posisi_jabatan_id', headData.posisi_jabatan_id);
            setValue('divisi_id', headData.divisi_id);
            setValue('department_id', headData.department_id);
            setValue('email_perusahaan', headData.email_perusahaan);
            setValue('manager_id', headData.manager_id);
            setValue('atasan_langsung_id', headData.atasan_langsung_id);
        }
    }, [headData, setValue]);

    // Master Data Hooks
    const { data: jenisKontrakList } = useJenisHubunganKerjaList();
    const { data: kategoriPangkatList } = useKategoriPangkatList();
    const { data: golonganList } = useGolonganList();
    const { data: subGolonganList } = useSubGolonganList();
    const { data: lokasiList } = useLokasiKerjaList();

    const onSubmit = (data: EmployeeStep2FormValues) => {
        onNext(data);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapOptions = (list: any[]) => list?.map(item => ({ value: item.id, label: item.nama })) || [];

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

            {/* Section 1: Kepegawaian (Read-Only from Head) */}
            <div className="bg-white border rounded-lg p-6 shadow-sm">
                <h4 className="flex items-center text-lg font-medium text-gray-900 mb-4 border-b pb-2">
                    <BriefcaseIcon className="w-5 h-5 mr-2 text-primary-600" />
                    Kepegawaian
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input label="NIK" disabled {...register('nomor_induk_karyawan')} className="bg-gray-100 placeholder-gray-500" />
                    <Input label="Email Perusahaan" disabled {...register('email_perusahaan')} className="bg-gray-100 placeholder-gray-500" />
                    {/* Display names if available in headData for better UX, though we primarily pass IDs. 
                        Since headData is strictly what we have in form state (IDs), we'll display IDs or placeholders 
                        if logic to fetch names isn't added. For now, we bind to IDs to ensure data consistency 
                        but mark as disabled. Ideally we'd look up the names from master data hooks.
                    */}
                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Posisi Jabatan</label>
                        <input
                            disabled
                            value={headData?.posisi_jabatan_id || ''}
                            className="bg-gray-100 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm text-gray-500"
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Divisi</label>
                        <input
                            disabled
                            value={headData?.divisi_id || ''}
                            className="bg-gray-100 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm text-gray-500"
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Departemen</label>
                        <input
                            disabled
                            value={headData?.department_id || ''}
                            className="bg-gray-100 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm text-gray-500"
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Manager</label>
                        <input
                            disabled
                            value={headData?.manager_id || ''}
                            className="bg-gray-100 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm text-gray-500"
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Atasan Langsung</label>
                        <input
                            disabled
                            value={headData?.atasan_langsung_id || ''}
                            className="bg-gray-100 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm text-gray-500"
                        />
                    </div>
                </div>
            </div>

            {/* Section 2: Kontrak */}
            <div className="bg-white border rounded-lg p-6 shadow-sm">
                <h4 className="flex items-center text-lg font-medium text-gray-900 mb-4 border-b pb-2">
                    <DocumentTextIcon className="w-5 h-5 mr-2 text-primary-600" />
                    Kontrak & Tanggal
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Controller
                        control={control}
                        name="jenis_hubungan_kerja_id"
                        render={({ field }) => (
                            <SearchableSelect
                                label="Jenis Hubungan Kerja"
                                options={mapOptions(jenisKontrakList?.data || [])}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.jenis_hubungan_kerja_id?.message}
                            />
                        )}
                    />
                    <Input label="Tanggal Masuk Group" type="date" {...register('tanggal_masuk_group')} error={errors.tanggal_masuk_group?.message} />
                    <Input label="Tanggal Masuk" type="date" {...register('tanggal_masuk')} error={errors.tanggal_masuk?.message} />
                    <Input label="Tanggal Permanent" type="date" {...register('tanggal_permanent')} error={errors.tanggal_permanent?.message} />
                    <Input label="Tanggal Kontrak" type="date" {...register('tanggal_kontrak')} error={errors.tanggal_kontrak?.message} />
                    <Input label="Tanggal Akhir Kontrak" type="date" {...register('tanggal_akhir_kontrak')} error={errors.tanggal_akhir_kontrak?.message} />
                    <Input label="Tanggal Berhenti" type="date" {...register('tanggal_berhenti')} error={errors.tanggal_berhenti?.message} />
                </div>
            </div>

            {/* Section 2.5: Dokumen Kontrak */}
            {employeeId && (
                <div className="bg-white border rounded-lg p-6 shadow-sm">
                    <h4 className="flex items-center text-lg font-medium text-gray-900 mb-4 border-b pb-2">
                        <DocumentTextIcon className="w-5 h-5 mr-2 text-primary-600" />
                        Dokumen Kontrak
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <DocumentUpload
                            employeeId={employeeId}
                            documentType="surat_kontrak"
                            label="Surat Kontrak"
                            maxFiles={5}
                        />
                        <DocumentUpload
                            employeeId={employeeId}
                            documentType="dokumen_lainnya"
                            label="Dokumen Pendukung Lainnya"
                            maxFiles={5}
                        />
                    </div>
                </div>
            )}

            {/* Section 3: Education */}
            <div className="bg-white border rounded-lg p-6 shadow-sm">
                <h4 className="flex items-center text-lg font-medium text-gray-900 mb-4 border-b pb-2">
                    <AcademicCapIcon className="w-5 h-5 mr-2 text-primary-600" />
                    Pendidikan
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Tingkat Pendidikan" {...register('tingkat_pendidikan')} error={errors.tingkat_pendidikan?.message} />
                    <Input label="Bidang Studi" {...register('bidang_studi')} error={errors.bidang_studi?.message} />
                    <Input label="Nama Sekolah" {...register('nama_sekolah')} error={errors.nama_sekolah?.message} />
                    <Input label="Kota Sekolah" {...register('kota_sekolah')} error={errors.kota_sekolah?.message} />
                    <Input label="Status Kelulusan" {...register('status_kelulusan')} error={errors.status_kelulusan?.message} />
                    <div className="col-span-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan Pendidikan</label>
                        <textarea
                            {...register('keterangan_pendidikan')}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                            rows={3}
                        />
                    </div>
                </div>
            </div>

            {/* Section 4: Pangkat */}
            <div className="bg-white border rounded-lg p-6 shadow-sm">
                <h4 className="flex items-center text-lg font-medium text-gray-900 mb-4 border-b pb-2">
                    <StarIcon className="w-5 h-5 mr-2 text-primary-600" />
                    Pangkat & Golongan
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Controller
                        control={control}
                        name="kategori_pangkat_id"
                        render={({ field }) => (
                            <SearchableSelect
                                label="Kategori Pangkat"
                                options={mapOptions(kategoriPangkatList?.data || [])}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.kategori_pangkat_id?.message}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="golongan_pangkat_id"
                        render={({ field }) => (
                            <SearchableSelect
                                label="Golongan"
                                options={mapOptions(golonganList?.data || [])}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.golongan_pangkat_id?.message}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="sub_golongan_pangkat_id"
                        render={({ field }) => (
                            <SearchableSelect
                                label="Sub Golongan"
                                options={mapOptions(subGolonganList?.data || [])}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.sub_golongan_pangkat_id?.message}
                            />
                        )}
                    />
                    <Input label="No. Dana Pensiun" {...register('no_dana_pensiun')} error={errors.no_dana_pensiun?.message} />
                </div>
            </div>

            {/* Section 5: Kontak Darurat */}
            <div className="bg-white border rounded-lg p-6 shadow-sm">
                <h4 className="flex items-center text-lg font-medium text-gray-900 mb-4 border-b pb-2">
                    <PhoneIcon className="w-5 h-5 mr-2 text-primary-600" />
                    Kontak Darurat
                </h4>

                {/* Kontak 1 */}
                <div className="mb-6">
                    <h5 className="font-medium text-gray-700 mb-3">Kontak Darurat 1</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Nama" {...register('nama_kontak_darurat_1')} error={errors.nama_kontak_darurat_1?.message} />
                        <Input label="Nomor Telepon" {...register('nomor_telepon_kontak_darurat_1')} error={errors.nomor_telepon_kontak_darurat_1?.message} />
                        <Input label="Hubungan" {...register('hubungan_kontak_darurat_1')} error={errors.hubungan_kontak_darurat_1?.message} />
                        <div className="col-span-full">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                            <textarea
                                {...register('alamat_kontak_darurat_1')}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                rows={2}
                            />
                        </div>
                    </div>
                </div>

                <hr className="my-4" />

                {/* Kontak 2 */}
                <div>
                    <h5 className="font-medium text-gray-700 mb-3">Kontak Darurat 2</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Nama" {...register('nama_kontak_darurat_2')} error={errors.nama_kontak_darurat_2?.message} />
                        <Input label="Nomor Telepon" {...register('nomor_telepon_kontak_darurat_2')} error={errors.nomor_telepon_kontak_darurat_2?.message} />
                        <Input label="Hubungan" {...register('hubungan_kontak_darurat_2')} error={errors.hubungan_kontak_darurat_2?.message} />
                        <div className="col-span-full">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                            <textarea
                                {...register('alamat_kontak_darurat_2')}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                rows={2}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 6: POO/POH */}
            <div className="bg-white border rounded-lg p-6 shadow-sm">
                <h4 className="flex items-center text-lg font-medium text-gray-900 mb-4 border-b pb-2">
                    <MapPinIcon className="w-5 h-5 mr-2 text-primary-600" />
                    Point of Origin / Hire
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Point of Origin" {...register('point_of_original')} error={errors.point_of_original?.message} />
                    <Input label="Point of Hire" {...register('point_of_hire')} error={errors.point_of_hire?.message} />
                </div>
            </div>

            {/* Section 7: Seragam */}
            <div className="bg-white border rounded-lg p-6 shadow-sm">
                <h4 className="flex items-center text-lg font-medium text-gray-900 mb-4 border-b pb-2">
                    <TagIcon className="w-5 h-5 mr-2 text-primary-600" />
                    Seragam & Sepatu
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Ukuran Seragam" {...register('ukuran_seragam_kerja')} error={errors.ukuran_seragam_kerja?.message} />
                    <Input label="Ukuran Sepatu" {...register('ukuran_sepatu_kerja')} error={errors.ukuran_sepatu_kerja?.message} />
                </div>
            </div>

            {/* Section 8: Pergerakan */}
            <div className="bg-white border rounded-lg p-6 shadow-sm">
                <h4 className="flex items-center text-lg font-medium text-gray-900 mb-4 border-b pb-2">
                    <ArrowsRightLeftIcon className="w-5 h-5 mr-2 text-primary-600" />
                    Pergerakan Karyawan
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Controller
                        control={control}
                        name="lokasi_sebelumnya_id"
                        render={({ field }) => (
                            <SearchableSelect
                                label="Lokasi Sebelumnya"
                                options={mapOptions(lokasiList?.data || [])}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.lokasi_sebelumnya_id?.message}
                            />
                        )}
                    />
                    <Input label="Tanggal Mutasi" type="date" {...register('tanggal_mutasi')} error={errors.tanggal_mutasi?.message} />
                </div>
            </div>

            {/* Section 9: Costing */}
            <div className="bg-white border rounded-lg p-6 shadow-sm">
                <h4 className="flex items-center text-lg font-medium text-gray-900 mb-4 border-b pb-2">
                    <BanknotesIcon className="w-5 h-5 mr-2 text-primary-600" />
                    Costing
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Siklus Pembayaran Gaji" {...register('siklus_pembayaran_gaji')} error={errors.siklus_pembayaran_gaji?.message} />
                    <Input label="Costing" {...register('costing')} error={errors.costing?.message} />
                    <Input label="Assign" {...register('assign')} error={errors.assign?.message} />
                    <Input label="Actual" {...register('actual')} error={errors.actual?.message} />
                </div>
            </div>

            {/* Footer Action Bar */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 -mx-6 -mb-6 flex justify-end space-x-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
                <Button variant="outline" type="button" onClick={onBack}>
                    Kembali
                </Button>
                <Button variant="primary" type="submit" className="flex items-center">
                    Lanjut ke Informasi Keluarga
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 ml-2">
                        <path fillRule="evenodd" d="M16.72 7.72a.75.75 0 011.06 0l3.75 3.75a.75.75 0 010 1.06l-3.75 3.75a.75.75 0 11-1.06-1.06l2.47-2.47H3a.75.75 0 010-1.5h16.19l-2.47-2.47a.75.75 0 010-1.06z" clipRule="evenodd" />
                    </svg>
                </Button>
            </div>

        </form >
    );
};
