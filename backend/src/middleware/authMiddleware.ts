import jwt from 'jsonwebtoken';
import { ExpressMiddleware } from 'src/@types/express';
import isAdmin from '../services/adminService';
import { JWT_SECRET } from '../env';

export const verifyToken: ExpressMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

        req.user = decoded as any;
        next();
    });
}