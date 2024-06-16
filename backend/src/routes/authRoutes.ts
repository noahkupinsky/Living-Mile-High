import { Router } from 'express';
import { login } from '../controllers/authController';

const router = Router();

router.post('/login', login);

router.get('/data', async (req, res) => {
    res.json({ data: 'yo' });
});

export default router;