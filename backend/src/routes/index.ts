import { Router } from 'express';
import createDevRoutes from './devRoutes';
import { IAdminService } from '../services/AdminService';
import { IAuthService } from '../services/AuthService';
import createAuthRoutes from './authRoutes';

const createRoutes = (adminService: IAdminService, authService: IAuthService) => {
    const router = Router();

    router.use('/dev', createDevRoutes(adminService));
    router.use('/auth', createAuthRoutes(authService));

    return router;
}

export default createRoutes;