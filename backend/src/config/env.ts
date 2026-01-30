import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

export const env = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
    db: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        name: process.env.DB_NAME || 'bebang_db',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '123456789',
    },
    jwtSecret: process.env.JWT_SECRET || 'secret',
    uploadDir: process.env.UPLOAD_DIR || './uploads',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
};
