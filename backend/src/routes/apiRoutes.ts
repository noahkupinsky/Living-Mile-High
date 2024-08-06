import { Router } from "express";
import authRouter from './authRoutes';
import houseRouter from './houseRoutes';
import assetRouter from './assetRoutes';
import backupRouter from './backupRoutes';
import generalDataRouter from './generalDataRoutes';
import verifyToken from '~/middleware/authMiddleware';
import { pruneSite } from "~/controllers/updateController";
import { sendContactEmail } from "~/controllers/emailController";

const router = Router();

// public routes

router.use('/auth', authRouter);

// protected routes

router.use('/house', verifyToken, houseRouter);
router.use('/general', verifyToken, generalDataRouter);
router.use('/backup', verifyToken, backupRouter);
router.use('/asset', verifyToken, assetRouter);
router.post('/prune', verifyToken, pruneSite);
router.post('/send-contact-email', sendContactEmail);

export default router;