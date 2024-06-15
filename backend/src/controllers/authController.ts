import jwt from 'jsonwebtoken';
import { ExpressMiddleware } from '../@types';
import { JWT_SECRET } from '../env';
import passport from '../config/passport';

type PassportCallback = (err: any, user: any, info: any) => void;

export const login: ExpressMiddleware = (req, res, next) => {
    const localJwtLogin: PassportCallback = (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({ message: info.message, user });
        }
        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    }
    passport.authenticate('local', { session: false }, localJwtLogin)(req, res, next);
};