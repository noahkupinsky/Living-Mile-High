import { Router } from 'express';
import apiRouter from './apiRoutes';

const router = Router();

router.use('/api', apiRouter);

export default router;