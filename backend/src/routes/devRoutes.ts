import isAdmin from '../services/adminService';
import { Router } from 'express';

const router = Router();

router.post('/admin-check', async (req, res) => {
    const { email } = req.body;
    const adminVerified = await isAdmin(email);
    res.json({ adminVerified });
});

export default router;