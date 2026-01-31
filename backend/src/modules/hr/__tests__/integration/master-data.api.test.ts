import request from 'supertest';
import { app } from '../../../../index';

// Mock Auth
jest.mock('../../../../shared/middleware/auth.middleware', () => ({
    authenticate: (req: any, res: any, next: any) => {
        req.user = { id: 1, role: 'Superadmin' };
        next();
    }
}));

jest.mock('../../../../shared/middleware/permission.middleware', () => ({
    checkPermission: () => (req: any, res: any, next: any) => next(),
    checkDepartmentAccess: () => (req: any, res: any, next: any) => next(),
    checkResourceOwnership: () => (req: any, res: any, next: any) => next(),
}));

jest.mock('../../../../shared/middleware/cache.middleware', () => ({
    cacheMiddleware: () => (req: any, res: any, next: any) => next()
}));

// Mock Master Data Controller
jest.mock('../../controllers/master-data.controller.ts', () => ({
    getAll: jest.fn().mockImplementation((req, res) => res.json({ data: [{ id: 1, nama: 'IT' }] })),
    getOne: jest.fn().mockImplementation((req, res) => res.json({ data: { id: 1, nama: 'IT' } })),
    create: jest.fn().mockImplementation((req, res) => res.status(201).json({ id: 2, nama: req.body.nama })),
    update: jest.fn().mockImplementation((req, res) => res.json({ id: 1, nama: req.body.nama })),
    delete: jest.fn().mockImplementation((req, res) => res.status(200).json({ message: 'Deleted' })),
    getDepartmentsByDivisi: jest.fn().mockImplementation((req, res) => res.json({ data: [] })),
    getPosisiByDepartment: jest.fn().mockImplementation((req, res) => res.json({ data: [] })),
    getManagers: jest.fn().mockImplementation((req, res) => res.json({ data: [] })),
    getActiveEmployees: jest.fn().mockImplementation((req, res) => res.json({ data: [] }))
}));

describe('Master Data API Integration', () => {
    describe('GET /api/hr/master/:model', () => {
        it('should return list of master data', async () => {
            const res = await request(app).get('/api/hr/master/department');
            expect(res.status).toBe(200);
            expect(res.body.data).toHaveLength(1);
        });
    });

    describe('POST /api/hr/master/:model', () => {
        it('should create master data', async () => {
            const res = await request(app)
                .post('/api/hr/master/department')
                .send({ nama: 'Finance' });

            expect(res.status).toBe(201);
            expect(res.body.nama).toBe('Finance');
        });
    });

    describe('PUT /api/hr/master/:model/:id', () => {
        it('should update master data', async () => {
            const res = await request(app)
                .put('/api/hr/master/department/1')
                .send({ nama: 'Finance Updated' });

            expect(res.status).toBe(200);
            expect(res.body.nama).toBe('Finance Updated');
        });
    });

    describe('DELETE /api/hr/master/:model/:id', () => {
        it('should delete master data', async () => {
            const res = await request(app).delete('/api/hr/master/department/1');
            expect(res.status).toBe(200);
        });
    });
});
