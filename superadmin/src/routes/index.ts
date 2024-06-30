import { Router } from 'express';
import adminRouter from './adminRoutes';

const router = Router();

router.use('/admin', adminRouter);

export default router;