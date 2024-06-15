import AdminModel from '../models/AdminModel';

async function isAdmin(email: string): Promise<boolean> {
    const admin = await AdminModel.findOne({ email });
    return !!admin;
}

export default isAdmin;