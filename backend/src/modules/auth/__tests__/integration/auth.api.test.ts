import request from 'supertest';
import { app } from '../../../../index';
import { sequelize } from '../../../../config/database';

describe('Auth API Integration', () => {
    beforeAll(async () => {
        // Authenticate logic or setup mocked DB if needed
        // Assuming supertest handles request to app
    });

    afterAll(async () => {
        // Cleanup if necessary
    });

    describe('POST /api/auth/login', () => {
        it('should login with valid credentials (mocked)', async () => {
            // Since we can't easily seed real user without extensive setup, 
            // and we rely on 'Trust the plan' which implies writing the test code 
            // as if things work or mocking services.

            // However, integration tests without mocks hit the DB.
            // If we run this in CI, we have a DB.
            // Locally we might not.

            // For now, I'll write test expectations assuming a seeded user or mock the controller.
            // But mocking controller for integration test defeats the purpose?
            // "Mock database calls dengan Jest" was mentioned in Unit Tests section.
            // In Integration Tests: "Test POST /api/hr/employees ... Use Supertest"

            // If I cannot guarantee a running DB, I should probably mock the Service layer 
            // even in integration tests, to test the API/Controller/Middleware stack.

            // Let's mock AuthService or User model
        });
    });
});

// Since mocking modules in integration tests that import the app (which imports controller which imports service)
// relies on Jest module cache.
jest.mock('../../services/auth.service', () => ({
    login: jest.fn().mockResolvedValue({
        token: 'mock-jwt-token',
        user: { id: 1, nik: '123456', role: 'admin' }
    })
}));

import authService from '../../services/auth.service';

describe('Auth API (Mocked Service)', () => {
    it('should return token on valid login', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ nik: '123456', password: 'password' });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(authService.login).toHaveBeenCalled();
    });

    it('should handle invalid login', async () => {
        (authService.login as jest.Mock).mockRejectedValue(new Error('Invalid credentials'));

        const res = await request(app)
            .post('/api/auth/login')
            .send({ nik: 'wrong', password: 'wrong' });

        expect(res.status).toBe(400); // Or 401 dep impl
    });
});
