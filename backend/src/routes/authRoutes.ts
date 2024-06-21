import { Router } from 'express';
import { login, verify } from '../controllers/authController';
import verifyToken from '../middleware/authMiddleware';
import { services } from '../app';

const router = Router();

router.post('/login', login);

router.post('/verify', verifyToken, verify);

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const { adminService } = services();
        await adminService.createUser(username, password);
        res.status(200).json({ success: true });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/data', verifyToken, async (req, res) => {
    res.json({ data: 'yo' });
});

export default router;