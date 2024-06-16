import { Router } from 'express';
import authRouter from './authRoutes';
import houseRouter from './houseRoutes';


const subRouter = Router();

subRouter.use('/auth', authRouter);
subRouter.use('/houses', houseRouter);

const router = Router();
router.use('/api', subRouter);

export default router;