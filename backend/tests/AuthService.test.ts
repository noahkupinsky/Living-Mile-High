import supertest from 'supertest';
import AdminModel from '../src/models/AdminModel';
import { getApp } from './setup';

let request: any;

describe('Auth Routes', () => {
    beforeAll(async () => {
        request = supertest(getApp());
    });

    beforeEach(async () => {
        await AdminModel.deleteMany({});
    });

    it('should reject invalid credentials', async () => {
        const response = await request.post('/api/auth/login').send({ password: 'wrong_password' });
        expect(response.status).toBe(401);
    });
});