import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { createEmployeeSchema, EmployeeFormValues } from '../../schemas/employee.schema';
import masterDataService from '../../services/api/master-data.service';
import { MasterData } from '../../types/hr';

const EmployeeCreatePage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('data_diri');
    const [isLoading, setIsLoading] = useState(false);

    // Master Data States
    const [divisi, setDivisi] = useState<MasterData[]>([]);
    const [departments, setDepartments] = useState<MasterData[]>([]);
    const [positions, setPositions] = useState<MasterData[]>([]);
    const [kategoriPangkat, setKategoriPangkat] = useState<MasterData[]>([]);
    const [golongan, setGolongan] = useState<MasterData[]>([]);
    const [subGolongan, setSubGolongan] = useState<MasterData[]>([]);
    const [jenisHubunganKerja, setJenisHubunganKerja] = useState<MasterData[]>([]);
    const [tags, setTags] = useState<MasterData[]>([]);
    const [lokasiKerja, setLokasiKerja] = useState<MasterData[]>([]);
    const [statusKaryawan, setStatusKaryawan] = useState<MasterData[]>([]);

    const { register, handleSubmit, formState: { errors } } = useForm<EmployeeFormValues>({
        resolver: zodResolver(createEmployeeSchema),
        defaultValues: {
            status_karyawan_id: undefined,
        }
    });

    useEffect(() => {
        const fetchMasterData = async () => {
            try {
                const [
                    divisiData, deptData, posData, catData, golData,
                    subGolData, relData, tagData, locData, statData
                ] = await Promise.all([
                    masterDataService.getAll('divisi'),
                    masterDataService.getAll('department'),
                    masterDataService.getAll('posisi-jabatan'),
                    masterDataService.getAll('kategori-pangkat'),
                    masterDataService.getAll('golongan'),
                    masterDataService.getAll('sub-golongan'),
                    masterDataService.getAll('jenis-hubungan-kerja'),
                    masterDataService.getAll('tag'),
                    masterDataService.getAll('lokasi-kerja'),
                    masterDataService.getAll('status-karyawan')
                ]);

                setDivisi(divisiData);
                setDepartments(deptData);
                setPositions(posData);
                setKategoriPangkat(catData);
                setGolongan(golData);
                setSubGolongan(subGolData);
                setJenisHubunganKerja(relData);
                setTags(tagData);
                setLokasiKerja(locData);
                setStatusKaryawan(statData);
            } catch (error) {
                console.error('Error fetching master data', error);
            }
        };

        fetchMasterData();
    }, []);

    const onSubmit = async (data: EmployeeFormValues) => {
        setIsLoading(true);
        console.log('Form Data:', data);
        // Implement API call to save employee here
        setTimeout(() => {
            setIsLoading(false);
            alert('Employee Created (Simulated)');
            navigate('/hr/employees');
        }, 1000);
    };

    const tabs = [
        { id: 'data_diri', label: 'Data Diri' },
        { id: 'kepegawaian', label: 'Kepegawaian' },
        { id: 'keluarga', label: 'Keluarga' },
        { id: 'pendidikan', label: 'Pendidikan & Lainnya' },
    ];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Tambah Karyawan Baru</h1>

            {/* Tabs */}
            <div className="flex border-b mb-6 overflow-x-auto">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-3 font-medium text-sm focus:outline-none whitespace-nowrap ${activeTab === tab.id
                            ? 'border-b-2 border-primary text-primary'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6">

                {/* Tab Content: Data Diri */}
                {activeTab === 'data_diri' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">NIK</label>
                            <input {...register('nik')} className="w-full border rounded px-3 py-2 focus:ring focus:ring-primary/30" />
                            {errors.nik && <p className="text-red-500 text-xs mt-1">{errors.nik.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                            <input {...register('name')} className="w-full border rounded px-3 py-2" />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input type="email" {...register('email')} className="w-full border rounded px-3 py-2" />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">No. Telepon</label>
                            <input {...register('phone')} className="w-full border rounded px-3 py-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tempat Lahir</label>
                            <input {...register('tempat_lahir')} className="w-full border rounded px-3 py-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir</label>
                            <input type="date" {...register('tanggal_lahir')} className="w-full border rounded px-3 py-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
                            <select {...register('jenis_kelamin')} className="w-full border rounded px-3 py-2">
                                <option value="">Pilih</option>
                                <option value="L">Laki-laki</option>
                                <option value="P">Perempuan</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Domisili</label>
                            <textarea {...register('alamat_domisili')} className="w-full border rounded px-3 py-2" rows={3}></textarea>
                        </div>
                    </div>
                )}

                {/* Tab Content: Kepegawaian */}
                {activeTab === 'kepegawaian' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Bergabung</label>
                            <input type="date" {...register('joinDate')} className="w-full border rounded px-3 py-2" />
                            {errors.joinDate && <p className="text-red-500 text-xs mt-1">{errors.joinDate.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status Karyawan</label>
                            <select {...register('status_karyawan_id', { valueAsNumber: true })} className="w-full border rounded px-3 py-2">
                                <option value="">Pilih Status</option>
                                {statusKaryawan.map(item => (
                                    <option key={item.id} value={item.id}>{item.nama}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Hubungan Kerja</label>
                            <select {...register('jenis_hubungan_kerja_id', { valueAsNumber: true })} className="w-full border rounded px-3 py-2">
                                <option value="">Pilih Hubungan Kerja</option>
                                {jenisHubunganKerja.map(item => (
                                    <option key={item.id} value={item.id}>{item.nama}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Divisi</label>
                            <select {...register('divisi_id', { valueAsNumber: true })} className="w-full border rounded px-3 py-2">
                                <option value="">Pilih Divisi</option>
                                {divisi.map(item => (
                                    <option key={item.id} value={item.id}>{item.nama}</option>
                                ))}
                            </select>
                            {errors.divisi_id && <p className="text-red-500 text-xs mt-1">{errors.divisi_id.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                            <select {...register('department_id', { valueAsNumber: true })} className="w-full border rounded px-3 py-2">
                                <option value="">Pilih Department</option>
                                {departments.map(item => (
                                    <option key={item.id} value={item.id}>{item.nama}</option>
                                ))}
                            </select>
                            {errors.department_id && <p className="text-red-500 text-xs mt-1">{errors.department_id.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Posisi / Jabatan</label>
                            <select {...register('posisi_jabatan_id', { valueAsNumber: true })} className="w-full border rounded px-3 py-2">
                                <option value="">Pilih Jabatan</option>
                                {positions.map(item => (
                                    <option key={item.id} value={item.id}>{item.nama}</option>
                                ))}
                            </select>
                            {errors.posisi_jabatan_id && <p className="text-red-500 text-xs mt-1">{errors.posisi_jabatan_id.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori Pangkat</label>
                            <select {...register('kategori_pangkat_id', { valueAsNumber: true })} className="w-full border rounded px-3 py-2">
                                <option value="">Pilih Kategori</option>
                                {kategoriPangkat.map(item => (
                                    <option key={item.id} value={item.id}>{item.nama}</option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Golongan</label>
                                <select {...register('golongan_id', { valueAsNumber: true })} className="w-full border rounded px-3 py-2">
                                    <option value="">Pilih Golongan</option>
                                    {golongan.map(item => (
                                        <option key={item.id} value={item.id}>{item.nama}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sub Golongan</label>
                                <select {...register('sub_golongan_id'.toString() as any, { valueAsNumber: true })} className="w-full border rounded px-3 py-2">
                                    <option value="">Pilih Sub</option>
                                    {subGolongan.map(item => (
                                        <option key={item.id} value={item.id}>{item.nama}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi Kerja</label>
                            <select {...register('lokasi_kerja_id', { valueAsNumber: true })} className="w-full border rounded px-3 py-2">
                                <option value="">Pilih Lokasi</option>
                                {lokasiKerja.map(item => (
                                    <option key={item.id} value={item.id}>{item.nama}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tag Karyawan</label>
                            <select {...register('tag_id', { valueAsNumber: true })} className="w-full border rounded px-3 py-2">
                                <option value="">Pilih Tag</option>
                                {tags.map(item => (
                                    <option key={item.id} value={item.id}>{item.nama}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                {/* Simplified placeholders for other tabs to save space/time as they are similar structure */}
                {activeTab === 'keluarga' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pasangan</label>
                            <input {...register('nama_pasangan')} className="w-full border rounded px-3 py-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Anak</label>
                            <input type="number" {...register('jumlah_anak', { valueAsNumber: true })} className="w-full border rounded px-3 py-2" />
                        </div>
                    </div>
                )}

                {activeTab === 'pendidikan' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Pendidikan Terakhir</label>
                            <input {...register('pendidikan_terakhir')} className="w-full border rounded px-3 py-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Rekening</label>
                            <input {...register('nomor_rekening')} className="w-full border rounded px-3 py-2" />
                        </div>
                    </div>
                )}


                <div className="mt-8 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/hr/employees')}
                        className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isLoading ? 'Menyimpan...' : 'Simpan Karyawan'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EmployeeCreatePage;
