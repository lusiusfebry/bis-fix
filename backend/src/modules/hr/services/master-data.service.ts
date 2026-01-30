import { Model, ModelStatic, Op } from 'sequelize';

class MasterDataService {
    async findAllWithFilter(model: ModelStatic<Model>, filters: any, include: any[] = []) {
        const { status, search, page = 1, limit = 10 } = filters;
        const offset = (Number(page) - 1) * Number(limit);
        const where: any = {};

        if (status) {
            // Handle both boolean and string status (Aktif/Tidak Aktif)
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
        return await model.findAll();
    }

    async findById(model: ModelStatic<Model>, id: number) {
        return await model.findByPk(id);
    }

    async create(model: ModelStatic<Model>, data: any) {
        return await model.create(data);
    }

    async update(model: ModelStatic<Model>, id: number, data: any) {
        const item = await model.findByPk(id);
        if (!item) return null;
        return await item.update(data);
    }

    async delete(model: ModelStatic<Model>, id: number) {
        const item = await model.findByPk(id);
        if (!item) return null;
        return await item.destroy();
    }
}

export default new MasterDataService();
