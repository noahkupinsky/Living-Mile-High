import AdminModel from '../models/AdminModel';

export interface IAdminService {
    isAdmin(email: string): Promise<boolean>;
}

class AdminService {
    async isAdmin(email: string): Promise<boolean> {
        const admin = await AdminModel.findOne({ email });
        return !!admin;
    }
}

export default AdminService;