import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { env } from './config/env';
import sequelize from './config/database';
import './modules/hr/models/associations'; // Import associations

const app = express();

// Middleware
import { performanceMonitor } from './shared/middleware/performance.middleware';
app.use(performanceMonitor);
app.use(helmet());
app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
import hrRoutes from './modules/hr/routes/hr.routes';

app.get('/', (req, res) => {
    res.send('Bebang Sistem Informasi API Running');
});

app.use('/api/hr', hrRoutes);
import authRoutes from './modules/auth/routes/auth.routes';
import roleRoutes from './modules/auth/routes/role.routes';
import userRoutes from './modules/auth/routes/user.routes';

app.use('/api/auth', authRoutes);
app.use('/api/auth', roleRoutes);
app.use('/api/auth', userRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
        error: env.nodeEnv === 'development' ? err.message : undefined,
    });
});

// Database connection and server start
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');

        // Initialize Scheduler
        try {
            const { initScheduler } = await import('./shared/utils/scheduler');
            initScheduler();
        } catch (schedErr) {
            console.error('Failed to initialize scheduler:', schedErr);
        }

        app.listen(env.port, async () => {
            console.log(`Server is running on port ${env.port}`);
            // Cache Warming
            try {
                const { default: cacheWarmingService } = await import('./shared/services/cache-warming.service');
                await cacheWarmingService.warmMasterDataCache();
            } catch (err) {
                console.error('Cache warming failed:', err);
            }
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
};

startServer();
