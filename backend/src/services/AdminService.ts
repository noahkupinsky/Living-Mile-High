import Admin from '../models/AdminModel';

export interface IAdminService {
    isAdmin(email: string): Promise<boolean>;
}

class AdminService {
    async isAdmin(email: string): Promise<boolean> {
        const admin = await Admin.findOne({ email });
        return !!admin;
    }
}

export default AdminService;