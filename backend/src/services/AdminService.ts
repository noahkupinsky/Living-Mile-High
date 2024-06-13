<<<<<<< HEAD
import AdminModel from '../models/AdminModel';
=======
import Admin from '../models/AdminModel';
>>>>>>> 22adf101e6238714a24934718dbd2494de052643

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