import { Router } from 'express';
import { IAdminService } from '../services/AdminService';

const createDevRoutes = (adminService: IAdminService) => {
    const router = Router();

    router.post('/admin-check', async (req, res) => {
        const { email } = req.body;
        const isAdmin = await adminService.isAdmin(email);
        res.json({ isAdmin });
    });

    return router;
};

export default createDevRoutes;