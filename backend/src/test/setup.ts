import sequelize from '../config/database';

beforeAll(async () => {
    // Global setup
    try {
        await sequelize.authenticate();
        // Use test database - assuming NODE_ENV=test handles this in config
        if (process.env.NODE_ENV !== 'test') {
            console.warn('WARNING: Running tests outside "test" environment!');
        }
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});

afterAll(async () => {
    // Global teardown
    await sequelize.close();
});

// Mock Redis to prevent needing a live Redis instance for all unit tests
jest.mock('../shared/services/cache.service', () => ({
    cacheService: {
        get: jest.fn().mockResolvedValue(null),
        set: jest.fn().mockResolvedValue(true),
        del: jest.fn().mockResolvedValue(true),
        delPattern: jest.fn().mockResolvedValue(true),
        remember: jest.fn((key, ttl, callback) => callback()),
    },
}));
