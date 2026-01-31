import { Model, ModelStatic, Op } from 'sequelize';
import cacheService from '../../../shared/services/cache.service';

class MasterDataService {
    async findAllWithFilter(model: ModelStatic<Model>, filters: any, include: any[] = []) {
        // Caching for filtered list is tricky because of many combinations.
        // For now, only cache raw findAll. If filters are used, bypass cache or use complex keys.
        // Plan focused on "findAll" method being cached (likely for dropdowns).

        const { status, search, page = 1, limit = 10 } = filters;
        const offset = (Number(page) - 1) * Number(limit);
        const where: any = {};

        if (status) {
            if (status === 'true' || status === true || status === 'Aktif') {
                where.status = 'Aktif';
            } else if (status === 'false' || status === false || status === 'Tidak Aktif') {
                where.status = 'Tidak Aktif';
            }
        }

        if (search) {
            where.nama = { [Op.like]: `%${search}%` };
        }

        const { count, rows } = await model.findAndCountAll({
            where,
            include,
            limit: Number(limit),
            offset: Number(offset),
            order: [['created_at', 'DESC']],
            distinct: true
        });

        return {
            data: rows,
            total: count,
            page: Number(page),
            totalPages: Math.ceil(count / Number(limit))
        };
    }

    async findAll(model: ModelStatic<Model>) {
        const modelName = model.name;
        const cacheKey = `master_data:${modelName}:all`;

        return await cacheService.remember(
            cacheKey,
            3600, // 1 hour TTL
            async () => await model.findAll()
        );
    }

    async findById(model: ModelStatic<Model>, id: number) {
        return await model.findByPk(id);
    }

    async invalidateCache(modelName: string) {
        await cacheService.delPattern(`master_data:${modelName}:*`);
    }

    async create(model: ModelStatic<Model>, data: any) {
        const result = await model.create(data);
        await this.invalidateCache(model.name);
        return result;
    }

    async update(model: ModelStatic<Model>, id: number, data: any) {
        const item = await model.findByPk(id);
        if (!item) return null;
        const result = await item.update(data);
        await this.invalidateCache(model.name);
        return result;
    }

    async delete(model: ModelStatic<Model>, id: number) {
        const item = await model.findByPk(id);
        if (!item) return null;
        await item.destroy();
        await this.invalidateCache(model.name);
        return true;
    }
}

export default new MasterDataService();
