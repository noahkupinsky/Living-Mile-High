import { Router } from 'express';
import createDevRoutes from './devRoutes';
import UserService from '../services/UserService';

const createRoutes = (userService: UserService) => {
    const router = Router();

    router.use('/dev', createDevRoutes(userService));

    return router;
}

export default createRoutes;