import { Router } from 'express';
import authRouter from './authRoutes';
import houseRouter from './houseRoutes';
import imageRouter from './imageRoutes';
import { updateGeneralData } from '../controllers/generalDataController';


const subRouter = Router();

subRouter.use('/auth', authRouter);
subRouter.use('/houses', houseRouter);
subRouter.use('/image', imageRouter);
subRouter.post('/general', updateGeneralData);

const router = Router();
router.use('/api', subRouter);

export default router;