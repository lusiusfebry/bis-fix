import request from 'supertest';
import { app } from '../../../../index';

jest.mock('../../../../shared/middleware/auth.middleware', () => ({
    authenticate: (req: any, res: any, next: any) => {
        req.user = { id: 1, role: 'Superadmin' };
        next();
    }
}));

jest.mock('../../../../shared/middleware/permission.middleware', () => ({
    checkPermission: () => (req: any, res: any, next: any) => next(),
    checkResourceOwnership: () => (req: any, res: any, next: any) => next(),
}));

jest.mock('../../../../shared/middleware/auditLog.middleware', () => ({
    auditLogger: () => (req: any, res: any, next: any) => next()
}));

// Mock Import Controller
jest.mock('../../controllers/import.controller.ts', () => ({
    uploadAndPreview: jest.fn().mockImplementation((req, res) => res.json({ preview: [] })),
    importEmployees: jest.fn().mockImplementation((req, res) => res.json({ success: 10, failed: 0 })),
    importMasterData: jest.fn().mockImplementation((req, res) => res.json({ success: 5, failed: 0 })),
    downloadErrorReport: jest.fn().mockImplementation((req, res) => res.send('buffer'))
}));

describe('Import API Integration', () => {
    describe('POST /api/hr/import/employees', () => {
        it('should import employees', async () => {
            const res = await request(app)
                .post('/api/hr/import/employees')
                .send({ file: 'mock-path' }); // In real integ test we upload file using .attach()

            expect(res.status).toBe(200);
        });
    });

    describe('POST /api/hr/import/master-data/:type', () => {
        it('should import master data', async () => {
            const res = await request(app)
                .post('/api/hr/import/master-data/divisi')
                .send({ file: 'mock-path' });

            expect(res.status).toBe(200);
        });
    });
});
