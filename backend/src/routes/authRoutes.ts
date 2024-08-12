import { Router } from 'express';
import { login, verify } from '~/controllers/authController';
import verifyToken from '~/middleware/authMiddleware';

const router = Router();

router.post('/login', login);

router.get('/verify', verifyToken, verify);

export default router;