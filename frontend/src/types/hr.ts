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

export interface EmployeePersonalInfo {
    id: number;
    employee_id: number;
    tempat_lahir?: string;
    tanggal_lahir?: string;
    jenis_kelamin?: string;
    agama?: string;
    status_pernikahan?: string;
    golongan_darah?: string;
    nomor_ktp?: string;
    nomor_npwp?: string;
    email_pribadi?: string;
    alamat_domisili?: string;
    kota_domisili?: string;
    provinsi_domisili?: string;
    kode_pos?: string;
    nama_pasangan?: string;
    pekerjaan_pasangan?: string;
    jumlah_anak?: number;
    createdAt: string;
    updatedAt: string;
}

export interface DataAnak {
    nama: string;
    jenis_kelamin: 'Laki-laki' | 'Perempuan';
    tanggal_lahir: string;
    keterangan?: string;
}

export interface DataSaudaraKandung {
    nama: string;
    jenis_kelamin: 'Laki-laki' | 'Perempuan';
    tanggal_lahir: string;
    pendidikan_terakhir?: string;
    pekerjaan?: string;
    keterangan?: string;
}

export interface EmployeeFamilyInfo {
    id: number;
    employee_id: number;
    tanggal_lahir_pasangan?: string;
    pendidikan_terakhir_pasangan?: string;
    keterangan_pasangan?: string;
    anak_ke?: number;
    jumlah_saudara_kandung?: number;
    nama_ayah_kandung?: string;
    nama_ibu_kandung?: string;
    alamat_orang_tua?: string;
    nama_ayah_mertua?: string;
    tanggal_lahir_ayah_mertua?: string;
    pendidikan_terakhir_ayah_mertua?: string;
    keterangan_ayah_mertua?: string;
    nama_ibu_mertua?: string;
    tanggal_lahir_ibu_mertua?: string;
    pendidikan_terakhir_ibu_mertua?: string;
    keterangan_ibu_mertua?: string;
    data_anak?: DataAnak[];
    data_saudara_kandung?: DataSaudaraKandung[];
    createdAt: string;
    updatedAt: string;
}

// QR Code Types
export interface QRCodeData {
    qrCode: string; // Base64 or URL
    nik: string;
    generatedAt?: string;
    employee?: Partial<Employee>;
}

export interface Employee {
    id: number;
    nama_lengkap: string;
    nomor_induk_karyawan: string;
    foto_karyawan?: string;
    email_perusahaan?: string;
    nomor_handphone?: string;

    // Foreign Keys
    divisi_id?: number;
    department_id?: number;
    posisi_jabatan_id?: number;
    status_karyawan_id?: number;
    lokasi_kerja_id?: number;
    tag_id?: number;
    manager_id?: number;
    atasan_langsung_id?: number;

    // Relations
    divisi?: Divisi;
    department?: Department;
    posisi_jabatan?: PosisiJabatan;
    status_karyawan?: StatusKaryawan;
    lokasi_kerja?: LokasiKerja;
    tag?: Tag;
    personal_info?: EmployeePersonalInfo;
    family_info?: EmployeeFamilyInfo;

    createdAt: string;
    updatedAt: string;
}

export type CreateEmployeeInput = Omit<Employee, 'id' | 'createdAt' | 'updatedAt' | 'divisi' | 'department' | 'posisi_jabatan' | 'status_karyawan' | 'lokasi_kerja' | 'tag' | 'personal_info'>;
export type UpdateEmployeeInput = Partial<CreateEmployeeInput>;
