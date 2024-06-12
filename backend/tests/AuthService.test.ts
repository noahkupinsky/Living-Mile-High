import supertest from 'supertest';
import createServer from '../src/app';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Admin from '../src/models/Admin';
import { getSupertest } from './setup';
import { AuthService } from '../src/services/AuthService';

let request: any;

describe('Auth Routes', () => {
    beforeAll(async () => {
        request = getSupertest();
    });

    beforeEach(async () => {
        await Admin.deleteMany({});
    });

    // it('should authenticate with master password and get token', async () => {
    //     const response = await request.post('/auth/login').send({ password: 'masterpassword' });
    //     expect(response.status).toBe(200);
    //     expect(response.body.token).toBeDefined();
    // });

    it('should reject invalid credentials', async () => {
        const response = await request.post('/api/auth/login').send({ password: 'wrong_password' });
        expect(response.status).toBe(401);
    });
});