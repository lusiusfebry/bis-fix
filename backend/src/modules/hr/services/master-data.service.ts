import { Model, ModelStatic } from 'sequelize';

class MasterDataService {
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
