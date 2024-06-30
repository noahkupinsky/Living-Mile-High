import { compare } from 'bcryptjs';
import { AdminService } from '../types';
import { AdminModel } from '../models/AdminModel';
import { hashPassword } from 'living-mile-high-lib';

class MongoAdminService implements AdminService {
    async getUserByLoginInfo(username: string, password: string): Promise<any> {
        console.log(await AdminModel.find({}));
        const user = await AdminModel.findOne({ username });
        if (!user) return null;
        const isMatch = await compare(password, user.password);
        if (!isMatch) return null;

        return user;
    }

    async createUser(username: string, password: string): Promise<any> {
        const hashedPassword = await hashPassword(password);
        const newUser = new AdminModel({ username, password: hashedPassword });
        await newUser.save();
        return newUser;
    }

    async getUserById(id: string): Promise<any> {
        return AdminModel.findById(id);
    }
}

export default MongoAdminService;