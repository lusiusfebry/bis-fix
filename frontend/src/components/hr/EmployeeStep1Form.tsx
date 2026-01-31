import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { employeeStep1Schema, EmployeeStep1FormValues } from '../../schemas/employee.schema';
import Input from '../common/Input';
import { SearchableSelect } from '../common/SearchableSelect';
import { PhotoUpload } from './PhotoUpload';
import Button from '../common/Button';
import {
    useDivisiList,
    useDepartmentList,
    usePosisiJabatanList,
    useStatusKaryawanList,
    useLokasiKerjaList,
    useTagList
} from '../../hooks/useMasterData';

interface EmployeeStep1FormProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialData?: any;
    onNext: (data: EmployeeStep1FormValues) => void;
    onCancel: () => void;
}

export const EmployeeStep1Form: React.FC<EmployeeStep1FormProps> = ({ initialData, onNext, onCancel }) => {
    const {
        register,
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<EmployeeStep1FormValues>({
        resolver: zodResolver(employeeStep1Schema),
        defaultValues: initialData
    });

    // Master Data Hooks
    const { data: divisiList } = useDivisiList();
    const { data: departmentList } = useDepartmentList();
    const { data: posisiList } = usePosisiJabatanList();
    const { data: statusList } = useStatusKaryawanList();
    const { data: lokasiList } = useLokasiKerjaList();
    const { data: tagList } = useTagList();

    const onSubmit = (data: EmployeeStep1FormValues) => {
        onNext(data);
    };

    // Map options for selects
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapOptions = (list: any[]) => list?.map(item => ({ value: item.id, label: item.nama })) || [];

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Section 1: Head (Photo & Basic Info) */}
            <div className="bg-white border rounded-lg p-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Photo Upload - Left */}
                    <div className="md:col-span-1 flex flex-col items-center justify-start pt-2">
                        <Controller
                            control={control}
                            name="foto_karyawan"
                            render={({ field: { value, onChange } }) => (
                                <PhotoUpload
                                    value={value}
                                    onChange={onChange}
                                    error={errors.foto_karyawan?.message as string}
                                />
                            )}
                        />
                    </div>

                    {/* Basic Fields - Right */}
                    <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="NIK"
                            {...register('nomor_induk_karyawan')}
                            error={errors.nomor_induk_karyawan?.message}
                            required
                            placeholder="Contoh: 2024001"
                        />
                        <Input
                            label="Nama Lengkap"
                            {...register('nama_lengkap')}
                            error={errors.nama_lengkap?.message}
                            required
                            placeholder="Nama Lengkap Karyawan"
                        />
                        <Controller
                            control={control}
                            name="divisi_id"
                            render={({ field }) => (
                                <SearchableSelect
                                    label="Divisi"
                                    options={mapOptions(divisiList?.data || [])}
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={errors.divisi_id?.message}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="department_id"
                            render={({ field }) => (
                                <SearchableSelect
                                    label="Departemen"
                                    options={mapOptions(departmentList?.data || [])}
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={errors.department_id?.message}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="posisi_jabatan_id"
                            render={({ field }) => (
                                <SearchableSelect
                                    label="Posisi Jabatan"
                                    options={mapOptions(posisiList?.data || [])}
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={errors.posisi_jabatan_id?.message}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="status_karyawan_id"
                            render={({ field }) => (
                                <SearchableSelect
                                    label="Status Karyawan"
                                    options={mapOptions(statusList?.data || [])}
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={errors.status_karyawan_id?.message}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="lokasi_kerja_id"
                            render={({ field }) => (
                                <SearchableSelect
                                    label="Lokasi Kerja"
                                    options={mapOptions(lokasiList?.data || [])}
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={errors.lokasi_kerja_id?.message}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="tag_id"
                            render={({ field }) => (
                                <SearchableSelect
                                    label="Tag Karyawan"
                                    options={mapOptions(tagList?.data || [])}
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={errors.tag_id?.message}
                                />
                            )}
                        />
                    </div>
                </div>
            </div>

            {/* Section 2: Personal Information Details */}
            <div className="bg-white border rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Informasi Detail</h3>

                {/* Group 1: Biodata */}
                <div className="mb-6">
                    <h4 className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                        <span className="mr-2">👤</span> Biodata
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                            label="Tempat Lahir"
                            {...register('tempat_lahir')}
                            error={errors.tempat_lahir?.message}
                        />
                        <Input
                            label="Tanggal Lahir"
                            type="date"
                            {...register('tanggal_lahir')}
                            error={errors.tanggal_lahir?.message}
                        />
                        <Controller
                            control={control}
                            name="jenis_kelamin"
                            render={({ field }) => (
                                <SearchableSelect
                                    label="Jenis Kelamin"
                                    options={[
                                        { value: 'Laki-laki', label: 'Laki-laki' },
                                        { value: 'Perempuan', label: 'Perempuan' }
                                    ]}
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={errors.jenis_kelamin?.message}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="agama"
                            render={({ field }) => (
                                <SearchableSelect
                                    label="Agama"
                                    options={[
                                        { value: 'Islam', label: 'Islam' },
                                        { value: 'Kristen', label: 'Kristen' },
                                        { value: 'Katolik', label: 'Katolik' },
                                        { value: 'Hindu', label: 'Hindu' },
                                        { value: 'Buddha', label: 'Buddha' },
                                        { value: 'Konghucu', label: 'Konghucu' }
                                    ]}
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={errors.agama?.message}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="status_pernikahan"
                            render={({ field }) => (
                                <SearchableSelect
                                    label="Status Pernikahan"
                                    options={[
                                        { value: 'Belum Menikah', label: 'Belum Menikah' },
                                        { value: 'Menikah', label: 'Menikah' },
                                        { value: 'Cerai Hidup', label: 'Cerai Hidup' },
                                        { value: 'Cerai Mati', label: 'Cerai Mati' }
                                    ]}
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={errors.status_pernikahan?.message}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="golongan_darah"
                            render={({ field }) => (
                                <SearchableSelect
                                    label="Golongan Darah"
                                    options={[
                                        { value: 'A', label: 'A' },
                                        { value: 'B', label: 'B' },
                                        { value: 'AB', label: 'AB' },
                                        { value: 'O', label: 'O' }
                                    ]}
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={errors.golongan_darah?.message}
                                />
                            )}
                        />
                    </div>
                </div>

                <hr className="my-6 border-gray-200" />

                {/* Group 2: Identitas & Kontak */}
                <div className="mb-6">
                    <h4 className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                        <span className="mr-2">🆔</span> Identitas & Kontak
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Nomor KTP"
                            {...register('nomor_ktp')}
                            error={errors.nomor_ktp?.message}
                        />
                        <Input
                            label="Nomor NPWP"
                            {...register('nomor_npwp')}
                            error={errors.nomor_npwp?.message}
                        />
                        <Input
                            label="Email Pribadi"
                            type="email"
                            {...register('email_pribadi')}
                            error={errors.email_pribadi?.message}
                        />
                        <Input
                            label="Nomor Handphone"
                            {...register('nomor_handphone')}
                            error={errors.nomor_handphone?.message}
                        />
                    </div>
                </div>

                <hr className="my-6 border-gray-200" />

                {/* Group 3: Alamat Domisili */}
                <div>
                    <h4 className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                        <span className="mr-2">🏠</span> Alamat Domisili
                    </h4>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="col-span-1">
                            {/* Reuse Input for textarea or just use textarea manually styling */}
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Alamat Lengkap
                            </label>
                            <textarea
                                {...register('alamat_domisili')}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                rows={3}
                            ></textarea>
                            {errors.alamat_domisili && <p className="mt-1 text-sm text-red-600">{errors.alamat_domisili.message}</p>}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                                label="Kota/Kabupaten"
                                {...register('kota_domisili')}
                                error={errors.kota_domisili?.message}
                            />
                            <Input
                                label="Provinsi"
                                {...register('provinsi_domisili')}
                                error={errors.provinsi_domisili?.message}
                            />
                            <Input
                                label="Kode Pos"
                                {...register('kode_pos')}
                                error={errors.kode_pos?.message}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Action Bar */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 -mx-6 -mb-6 flex justify-end space-x-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10 transition-transform">
                <Button variant="outline" type="button" onClick={onCancel}>
                    Batal
                </Button>
                <Button variant="primary" type="submit" className="flex items-center">
                    Lanjut ke Informasi HR
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 ml-2">
                        <path fillRule="evenodd" d="M16.72 7.72a.75.75 0 011.06 0l3.75 3.75a.75.75 0 010 1.06l-3.75 3.75a.75.75 0 11-1.06-1.06l2.47-2.47H3a.75.75 0 010-1.5h16.19l-2.47-2.47a.75.75 0 010-1.06z" clipRule="evenodd" />
                    </svg>
                </Button>
            </div>
        </form>
    );
};
