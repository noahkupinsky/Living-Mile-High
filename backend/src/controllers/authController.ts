import jwt from 'jsonwebtoken';
import { ExpressEndpoint, ExpressMiddleware } from 'src/@types/express';
import env from '../config/env';
import passport from '../config/passport';

type PassportCallback = (err: any, user: any, info: any) => void;

export const login: ExpressMiddleware = (req, res, next) => {
    const localJwtLogin: PassportCallback = (err, user, info) => {
        if (err || !user) {
            return res.status(401).json({ message: info.message, user });
        }
        const token = jwt.sign({ id: user.id, role: user.role }, env('JWT_SECRET'), { expiresIn: '1h' });
        res.cookie('token', token, {
            httpOnly: true,
            //secure: req.secure || req.headers['x-forwarded-proto'] === 'https', // Use secure cookies in production
            //sameSite: 'strict', // Prevents CSRF attacks
        });

        res.status(200).json({ message: 'Logged in successfully' });
    }
    passport.authenticate('local', { session: false }, localJwtLogin)(req, res, next);
};

export const verify: ExpressEndpoint = (req, res) => {
    res.json({ success: true });
}