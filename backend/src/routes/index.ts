import { Router } from 'express';
import eventRouter from './eventRoutes';
import apiRouter from './apiRoutes';

const router = Router();

router.use('/api', apiRouter);
router.use('/events', eventRouter);

export default router;