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

jest.mock('../../controllers/export.controller.ts', () => ({
    exportToExcel: jest.fn().mockImplementation((req, res) => res.send('excel-buffer')),
    exportEmployeeToPDF: jest.fn().mockImplementation((req, res) => res.send('pdf-buffer'))
}));

describe('Export API Integration', () => {
    describe('GET /api/hr/employees/export/excel', () => {
        it('should export excel', async () => {
            const res = await request(app).get('/api/hr/employees/export/excel');
            expect(res.status).toBe(200);
        });
    });

    describe('GET /api/hr/employees/:id/export/pdf', () => {
        it('should export pdf', async () => {
            const res = await request(app).get('/api/hr/employees/1/export/pdf');
            expect(res.status).toBe(200);
        });
    });
});
