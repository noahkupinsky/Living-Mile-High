import { Router } from 'express';
import authRouter from './authRoutes';


const subRouter = Router();

subRouter.use('/auth', authRouter);

const router = Router();
router.use('/api', subRouter);

export default router;