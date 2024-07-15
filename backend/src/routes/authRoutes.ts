import { Router } from 'express';
import { login, verify } from '~/controllers/authController';
import verifyToken from '~/middleware/authMiddleware';

const router = Router();

router.post('/login', login);

router.post('/verify', verifyToken, verify);

router.get('/data', verifyToken, async (req, res) => {
    res.json({ data: 'yo' });
});

export default router;