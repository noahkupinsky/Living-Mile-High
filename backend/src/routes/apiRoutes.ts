import { Router } from "express";
import authRouter from './authRoutes';
import houseRouter from './houseRoutes';
import imageRouter from './imageRoutes';
import backupRouter from './backupRoutes';
import generalDataRouter from './generalDataRoutes';
import verifyToken from '~/middleware/authMiddleware';

const router = Router();

// public routes

router.use('/auth', authRouter);

// protected routes

router.use('/house', verifyToken, houseRouter);
router.use('/general', verifyToken, generalDataRouter);
router.use('/backup', verifyToken, backupRouter);
router.use('/image', verifyToken, imageRouter);

export default router;