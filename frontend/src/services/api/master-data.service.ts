import client from './client';
import { MasterData } from '../../types/hr';

const getMasterData = async <T = MasterData>(model: string): Promise<T[]> => {
    const response = await client.get<{ status: string; data: T[] }>(`/hr/master/${model}`);
    return response.data.data;
};

const getMasterDataById = async <T = MasterData>(model: string, id: number): Promise<T> => {
    const response = await client.get<{ status: string; data: T }>(`/hr/master/${model}/${id}`);
    return response.data.data;
};

const masterDataService = {
    getAll: getMasterData,
    getOne: getMasterDataById,
};

export default masterDataService;
