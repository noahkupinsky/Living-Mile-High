import { Router } from 'express';
import authRouter from './authRoutes';
import devRouter from './devRoutes';

const createRoutes = () => {
    const router = Router();

    router.use('/dev', devRouter);
    router.use('/auth', authRouter);

    const apiRouter = Router();
    apiRouter.use('/api', router);

    return apiRouter;
}

export default createRoutes;