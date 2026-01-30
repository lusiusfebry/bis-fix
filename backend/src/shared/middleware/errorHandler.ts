import { Request, Response, NextFunction } from 'express';
// import logger from '../utils/logger'; 
import { env } from '../../config/env';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    // logger.error(err.message, { stack: err.stack });

    res.status(500).json({
        status: 'error',
        message: 'Something went wrong',
        error: env.nodeEnv === 'development' ? err.message : undefined,
    });
};
