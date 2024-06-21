import supertest from 'supertest';
import { getApp, services } from '../src/app';

let agent: any;


beforeAll(() => {
    agent = supertest.agent(getApp());
});

describe('Auth Routes', () => {
    const loginEndpoint = '/api/auth/login';

    it('should login an existing user with correct credentials', async () => {
        const { adminService } = services();
        await adminService.createUser('admin', 'password123');
        const response = await agent.post(loginEndpoint).send({
            username: 'admin',
            password: 'password123'
        });
        expect(response.status).toBe(200);
    });

    it('should not login with incorrect credentials', async () => {
        const { adminService } = services();
        await adminService.createUser('admin', 'password123');
        const response = await agent.post(loginEndpoint).send({
            username: 'admin',
            password: 'wrongpassword'
        });
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'Invalid username or password');
    });
});