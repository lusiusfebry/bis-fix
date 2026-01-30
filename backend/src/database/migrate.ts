import sequelize from '../config/database';

const migrate = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected...');

        // Sync all models
        // Note: For production, consider using Umzug or Sequelize CLI for better migration control
        await sequelize.sync({ alter: true });

        console.log('Database synchronized successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrate();
