import passport from 'passport';
import jwt from 'jsonwebtoken';
import { ExpressEndpoint } from '../@types';
import { JWT_SECRET } from '../env';

type PassportCallback = (err: any, user: any, info: any) => void;

export const login: ExpressEndpoint = (req, res) => {
    const localJwtLogin: PassportCallback = (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({ message: 'Something is not right', user });
        }
        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    }
    passport.authenticate('local', { session: false }, localJwtLogin)(req, res);
};

export const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

export const googleAuthCallback: ExpressEndpoint = (req, res) => {
    const googleJwtLogin: PassportCallback = (err, user, info) => {
        if (err || !user) {
            return res.redirect('/login');
        }
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    }
    passport.authenticate('google', { session: false }, googleJwtLogin)(req, res);
};