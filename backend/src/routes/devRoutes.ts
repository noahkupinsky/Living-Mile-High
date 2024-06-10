import { Router } from 'express';
import UserService from '../services/UserService';

const createDevRoutes = (userService: UserService) => {
    const router = Router();

    router.post('/admin-check', async (req, res) => {
        const { email } = req.body;
        const isAdmin = await userService.isAdmin(email);
        res.json({ isAdmin });
    });

    return router;
};

export default createDevRoutes;