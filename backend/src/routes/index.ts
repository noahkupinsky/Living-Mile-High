import { Router } from 'express';
import authRouter from './authRoutes';
import houseRouter from './houseRoutes';
import imageRouter from './imageRoutes';
import dataRouter from './dataRoutes';


const subRouter = Router();

subRouter.use('/auth', authRouter);
subRouter.use('/houses', houseRouter);
subRouter.use('/image', imageRouter);
subRouter.use('/data', dataRouter);

const router = Router();
router.use('/api', subRouter);

export default router;