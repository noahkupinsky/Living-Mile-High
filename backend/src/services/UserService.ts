import User from '../models/User';

class UserService {
    async isAdmin(email: string): Promise<boolean> {
        const user = await User.findOne({ email });
        return user?.role === 'admin' ?? false;
    }
}

export default UserService;