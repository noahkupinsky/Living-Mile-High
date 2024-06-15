import { getSupertest } from './setup';
import AdminModel from '@/models/AdminModel';

let request: any;

describe('Admin Service Routes', () => {
    beforeAll(async () => {
        request = getSupertest();
    });

    beforeEach(async () => {
        await AdminModel.deleteMany({});
    });

    it('should return true for an admin user', async () => {
        await AdminModel.create({ email: 'admin@example.com' });

        const response = await request.post('/api/dev/admin-check').send({ email: 'admin@example.com' });

        expect(response.status).toBe(200);
        expect(response.body.isAdmin).toBe(true);
    });

    it('should return false for a non-existent user', async () => {
        const response = await request.post('/api/dev/admin-check').send({ email: 'nonexistent@example.com' });

        expect(response.status).toBe(200);
        expect(response.body.isAdmin).toBe(false);
    });
});