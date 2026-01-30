import sequelize from './config/database';

async function check() {
    try {
        const [results] = await sequelize.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'employee_personal_info'");
        console.log('Columns:', JSON.stringify(results.map((r: any) => r.column_name)));
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

check();
