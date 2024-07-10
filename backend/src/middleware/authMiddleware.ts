import jwt from 'jsonwebtoken';
import env from '~/config/env';
import { ExpressMiddleware } from '~/@types';

const verifyToken: ExpressMiddleware = (req, res, next) => {
    const { JWT_SECRET } = env();
    const token = req.cookies.token;

    if (!token) {
        return res.status(403).send({ auth: false, message: 'No token provided.' })
    };

    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

        req.user = decoded;
        next();
    });
}

export default verifyToken