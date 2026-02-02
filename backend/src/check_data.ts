
import sequelize from './config/database';
import { Divisi, Department } from './modules/hr/models';

async function check() {
    try {
        await sequelize.authenticate();
        const divisis = await Divisi.findAll();

        for (const d of divisis) {
            const departments = await Department.findAll({ where: { divisi_id: d.id } });
            console.log(`Divisi ID: ${d.id}, Nama: "${d.nama}", Status: ${d.status}`);
            if (departments.length > 0) {
                console.log(`  Depts: ${departments.map(dept => `${dept.nama} (${dept.status})`).join(', ')}`);
            }
        }

    } catch (err) {
        console.error(err);
    } finally {
        await sequelize.close();
    }
}

check();
