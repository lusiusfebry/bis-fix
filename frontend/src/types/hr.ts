export interface MasterData {
    id: number;
    nama: string;
    keterangan?: string;
    status: 'Aktif' | 'Tidak Aktif';
    createdAt: string;
    updatedAt: string;
}

export interface Divisi extends MasterData {
    departments?: Department[];
}
export interface Department extends MasterData {
    divisi_id: number;
    manager_id?: number | null;
    divisi?: Divisi;
    manager?: { name: string };
}
export interface PosisiJabatan extends MasterData {
    department_id: number;
    department?: Department;
}
export interface KategoriPangkat extends MasterData { }
export interface Golongan extends MasterData { }
export interface SubGolongan extends MasterData { }
export interface JenisHubunganKerja extends MasterData { }
export interface Tag extends MasterData {
    warna_tag: string;
}
export interface LokasiKerja extends MasterData {
    alamat?: string;
}
export interface StatusKaryawan extends MasterData { }

export interface Employee {
    id: number;
    nik: string;
    name: string;
    email: string;
    phone?: string;
    joinDate: string;
    photo?: string;

    // Foreign Keys to Master Data (Optional for now as we transition)
    divisi_id?: number;
    department_id?: number;
    posisi_jabatan_id?: number;
    kategori_pangkat_id?: number;
    golongan_id?: number;
    sub_golongan_id?: number;
    jenis_hubungan_kerja_id?: number;
    tag_id?: number;
    lokasi_kerja_id?: number;
    status_karyawan_id?: number;

    // Relations
    divisi?: Divisi;
    department?: Department;
    posisi_jabatan?: PosisiJabatan;

    // Legacy fields (to be deprecated or mapped)
    position?: string;
    // department: string; // Removing text-based department to enforce relation

    // Personal Info
    tempat_lahir?: string;
    tanggal_lahir?: string;
    jenis_kelamin?: 'L' | 'P';
    agama?: string;
    status_pernikahan?: string;
    alamat_ktp?: string;
    alamat_domisili?: string;

    // Family Info
    nama_pasangan?: string;
    jumlah_anak?: number;

    // Education & Others
    pendidikan_terakhir?: string;
    jurusan?: string;
    nama_bank?: string;
    nomor_rekening?: string;
    npwp?: string;
    bpjs_kesehatan?: string;
    bpjs_ketenagakerjaan?: string;

    createdAt: string;
    updatedAt: string;
}

export type CreateEmployeeInput = Omit<Employee, 'id' | 'createdAt' | 'updatedAt' | 'divisi' | 'department' | 'posisi_jabatan'>;
export type UpdateEmployeeInput = Partial<CreateEmployeeInput>;
