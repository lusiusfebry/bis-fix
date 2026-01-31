import { Request, Response, NextFunction } from 'express';
// import logger from '../utils/logger'; 
import { env } from '../../config/env';

export const errorHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
    // logger.error(err.message, { stack: err.stack });

    // Handle custom validation error thrown as Error with JSON string
    try {
        const parsed = JSON.parse(err.message);
        if (parsed.message === 'Terjadi kesalahan validasi' && Array.isArray(parsed.errors)) {
            return res.status(400).json({
                status: 'error',
                message: parsed.message,
                errors: parsed.errors
            });
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_e) {
        // Not a JSON error, proceed
    }

    res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
        error: env.nodeEnv === 'development' ? err.message : undefined,
    });
};
