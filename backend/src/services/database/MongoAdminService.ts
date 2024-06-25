import bcrypt from 'bcrypt';
import { AdminService } from '../../types';
import AdminModel from '../../models/adminModel';

class MongoAdminService implements AdminService {
    async getUserByLoginInfo(username: string, password: string): Promise<any> {
        const user = await AdminModel.findOne({ username });
        if (!user) return null;
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return null;

        return user;
    }

    async createUser(username: string, password: string): Promise<any> {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new AdminModel({ username, password: hashedPassword });
        await newUser.save();
        return newUser;
    }

    async getUserById(id: string): Promise<any> {
        return AdminModel.findById(id);
    }
}

export default MongoAdminService;