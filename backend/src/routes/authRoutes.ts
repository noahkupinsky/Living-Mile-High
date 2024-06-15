import { Router } from 'express';
import { login, googleAuth, googleAuthCallback } from '../controllers/authController';

const router = Router();

router.post('/login', login);
router.get('/google', googleAuth);
router.get('/google/callback', googleAuthCallback);

router.get('/data', async (req, res) => {
    res.json({ data: 'yo' });
});

export default router;