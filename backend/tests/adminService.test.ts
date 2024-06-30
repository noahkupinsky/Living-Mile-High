import bcrypt from 'bcrypt';
import { AdminService } from '../src/types';
import { services } from '../src/app';
import { AdminModel } from '../src/models/AdminModel';

let adminService: AdminService;

beforeAll(async () => {
    adminService = services().adminService;
})

describe('MongoAdminService', () => {

    it('should create a new user', async () => {
        const user = await adminService.createUser('admin', 'password123');
        expect(user).toHaveProperty('username', 'admin');
        const savedUser = await AdminModel.findOne({ username: 'admin' });
        expect(savedUser).not.toBeNull();
        const isMatch = await bcrypt.compare('password123', savedUser!.password);
        expect(isMatch).toBe(true);
    });

    it('should get a user by login info', async () => {
        await adminService.createUser('admin', 'password123');
        const user = await adminService.getUserByLoginInfo('admin', 'password123');
        expect(user).not.toBeNull();
        expect(user).toHaveProperty('username', 'admin');
    });

    it('should return null for incorrect login info', async () => {
        await adminService.createUser('admin', 'password123');
        const user = await adminService.getUserByLoginInfo('admin', 'wrongpassword');
        expect(user).toBeNull();
    });

    it('should get a user by ID', async () => {
        const newUser = await adminService.createUser('admin', 'password123');
        const user = await adminService.getUserById(newUser.id);
        expect(user).not.toBeNull();
        expect(user).toHaveProperty('username', 'admin');
    });
});