import jwt from 'jsonwebtoken';
import { ExpressMiddleware } from 'src/types/express';
import env from '../config/env';

const verifyToken: ExpressMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(403).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, env('JWT_SECRET'), (err: any, decoded: any) => {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

        req.user = decoded;
        next();
    });
}

export default verifyToken