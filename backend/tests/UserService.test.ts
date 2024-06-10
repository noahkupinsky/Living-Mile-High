import { getSupertest } from './setup';
import User from '../src/models/User';

let request: any;

describe('UserService Routes', () => {
    beforeAll(async () => {
        request = getSupertest();
    });

    beforeEach(async () => {
        await User.deleteMany({});
    });

    it('should return true for an admin user', async () => {
        await User.create({ email: 'admin@example.com', role: 'admin' });

        const response = await request.post('/dev/admin-check').send({ email: 'admin@example.com' });

        expect(response.status).toBe(200);
        expect(response.body.isAdmin).toBe(true);
    });

    it('should return false for a non-admin user', async () => {
        await User.create({ email: 'user@example.com', role: 'user' });

        const response = await request.post('/dev/admin-check').send({ email: 'user@example.com' });

        expect(response.status).toBe(200);
        expect(response.body.isAdmin).toBe(false);
    });

    it('should return false for a non-existent user', async () => {
        const response = await request.post('/dev/admin-check').send({ email: 'nonexistent@example.com' });

        expect(response.status).toBe(200);
        expect(response.body.isAdmin).toBe(false);
    });
});