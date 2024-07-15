import { Router } from 'express';
import authRouter from './authRoutes';
import houseRouter from './houseRoutes';
import imageRouter from './imageRoutes';
import eventRouter from './eventRoutes';
import { updateGeneralData } from '../controllers/generalDataController';


const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/houses', houseRouter);
apiRouter.use('/image', imageRouter);
apiRouter.post('/general', updateGeneralData);

const router = Router();

router.use('/api', apiRouter);
router.use('/events', eventRouter);

export default router;