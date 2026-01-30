import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import masterDataService, { FilterParams } from '../services/api/master-data.service';
import { MasterData, Divisi, Department, PosisiJabatan, Tag, LokasiKerja } from '../types/hr';

export const useMasterDataList = <T = MasterData>(modelName: string, filters?: FilterParams) => {
    return useQuery({
        queryKey: ['masterData', modelName, filters],
        queryFn: () => masterDataService.getAll<T>(modelName, filters),
        placeholderData: keepPreviousData,
    });
};

export const useMasterDataById = <T = MasterData>(modelName: string, id: number) => {
    return useQuery({
        queryKey: ['masterData', modelName, id],
        queryFn: () => masterDataService.getOne<T>(modelName, id),
        enabled: !!id,
    });
};

export const useCreateMasterData = <T = MasterData>(modelName: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<T> | FormData) => masterDataService.create<T>(modelName, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['masterData', modelName] });
        },
    });
};

export const useUpdateMasterData = <T = MasterData>(modelName: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<T> | FormData }) => masterDataService.update<T>(modelName, id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['masterData', modelName] });
        },
    });
};

export const useDeleteMasterData = (modelName: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => masterDataService.delete(modelName, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['masterData', modelName] });
        },
    });
};

// Specific Hooks
export const useDivisiList = (filters?: FilterParams) => useMasterDataList<Divisi>('divisi', filters);
export const useDepartmentList = (filters?: FilterParams) => useMasterDataList<Department>('department', filters);
export const usePosisiJabatanList = (filters?: FilterParams) => useMasterDataList<PosisiJabatan>('posisi-jabatan', filters);
export const useKategoriPangkatList = (filters?: FilterParams) => useMasterDataList('kategori-pangkat', filters);
export const useGolonganList = (filters?: FilterParams) => useMasterDataList('golongan', filters);
export const useSubGolonganList = (filters?: FilterParams) => useMasterDataList('sub-golongan', filters);
export const useJenisHubunganKerjaList = (filters?: FilterParams) => useMasterDataList('jenis-hubungan-kerja', filters);
export const useTagList = (filters?: FilterParams) => useMasterDataList<Tag>('tag', filters);
export const useLokasiKerjaList = (filters?: FilterParams) => useMasterDataList<LokasiKerja>('lokasi-kerja', filters);
export const useStatusKaryawanList = (filters?: FilterParams) => useMasterDataList('status-karyawan', filters);
