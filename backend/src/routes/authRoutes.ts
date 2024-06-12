import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { IAuthService } from '../services/AuthService';
import { JWT_SECRET } from '../env';

const createAuthRoutes = (authService: IAuthService) => {
    const router = Router();

    router.post('/login', async (req, res) => {
        const { password, token } = req.body;
        console.log(password);
        if (password && await authService.verifyMasterPassword(password)) {
            const userToken = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
            return res.json({ success: true, token: userToken });
        } else if (token && await authService.verifyGoogleToken(token)) {
            const userToken = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
            return res.json({ success: true, token: userToken });
        }
        res.status(401).json({ success: false });
    });

    router.get('/data', async (req, res) => {
        res.json({ data: 'hello' });
    });

    return router;
};

export default createAuthRoutes;