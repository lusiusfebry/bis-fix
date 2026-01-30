import { Request, Response, NextFunction } from 'express';
import masterDataService from '../services/master-data.service';
import * as models from '../models';

class MasterDataController {
    private getModel(modelName: string) {
        // Map URL slug to Model Name
        const map: { [key: string]: string } = {
            'divisi': 'Divisi',
            'department': 'Department',
            'posisi-jabatan': 'PosisiJabatan',
            'kategori-pangkat': 'KategoriPangkat',
            'golongan': 'Golongan',
            'sub-golongan': 'SubGolongan',
            'jenis-hubungan-kerja': 'JenisHubunganKerja',
            'tag': 'Tag',
            'lokasi-kerja': 'LokasiKerja',
            'status-karyawan': 'StatusKaryawan'
        };

        const key = map[modelName];
        return key ? (models as any)[key] : null;
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const model = this.getModel(req.params.model);
            if (!model) return res.status(404).json({ message: 'Resource not found' });

            const data = await masterDataService.findAll(model);
            res.json({ status: 'success', data });
        } catch (error) {
            next(error);
        }
    }

    async getOne(req: Request, res: Response, next: NextFunction) {
        try {
            const model = this.getModel(req.params.model);
            if (!model) return res.status(404).json({ message: 'Resource not found' });

            const data = await masterDataService.findById(model, Number(req.params.id));
            if (!data) return res.status(404).json({ message: 'Item not found' });

            res.json({ status: 'success', data });
        } catch (error) {
            next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const model = this.getModel(req.params.model);
            if (!model) return res.status(404).json({ message: 'Resource not found' });

            const data = await masterDataService.create(model, req.body);
            res.status(201).json({ status: 'success', data });
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const model = this.getModel(req.params.model);
            if (!model) return res.status(404).json({ message: 'Resource not found' });

            const data = await masterDataService.update(model, Number(req.params.id), req.body);
            if (!data) return res.status(404).json({ message: 'Item not found' });

            res.json({ status: 'success', data });
        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const model = this.getModel(req.params.model);
            if (!model) return res.status(404).json({ message: 'Resource not found' });

            const success = await masterDataService.delete(model, Number(req.params.id));
            if (!success) return res.status(404).json({ message: 'Item not found' });

            res.json({ status: 'success', message: 'Item deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
}

export default new MasterDataController();
