import jwt from 'jsonwebtoken';
import { ExpressMiddleware } from '../@types';
import isAdmin from '../services/adminService';
import { JWT_SECRET } from '../env';

export const verifyToken: ExpressMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

        req.user = decoded as any;
        next();
    });
}

export const checkAdminRole: ExpressMiddleware = async (req, res, next) => {
    if (req.user?.role === 'google') {
        const adminVerified = await isAdmin(req.user.email!);
        if (adminVerified) {
            req.user.role = 'admin';
        } else {
            req.user.role = 'user';
        }
    }
    next();
};