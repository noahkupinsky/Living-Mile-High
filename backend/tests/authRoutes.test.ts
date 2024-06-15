import { getDatabase } from '../src/app';
import { getRequest } from './setup';

let request: any;

describe('Auth Routes', () => {
    const loginEndpoint = '/api/auth/login';

    beforeAll(() => {
        request = getRequest();
    })

    beforeEach(async () => {
        const adminService = getDatabase().adminService;
        await adminService.createUser('admin', 'password123');
    });

    it('should login an existing user with correct credentials', async () => {

        const response = await request.post(loginEndpoint).send({
            username: 'admin',
            password: 'password123'
        });
        expect(response.status).toBe(200);
    });

    it('should not login with incorrect credentials', async () => {
        const response = await request.post(loginEndpoint).send({
            username: 'admin',
            password: 'wrongpassword'
        });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Invalid username or password');
    });
});