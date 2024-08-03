import jwt from 'jsonwebtoken';
import { LoginResponse, VerifyResponse } from 'living-mile-high-lib';
import { ExpressEndpoint, ExpressMiddleware } from '~/@types';
import env from '~/config/env';
import passport from '~/config/passport';

type PassportCallback = (err: any, user: any, info: any) => void;

export const login: ExpressMiddleware = (req, res, next) => {
    const { JWT_SECRET } = env();

    const localJwtLogin: PassportCallback = async (err, user, info) => {
        if (err || !user) {
            const errorResponse: LoginResponse = { message: 'Invalid username or password' };
            return res.status(401).json(errorResponse);
        }

        const sessionId = Date.now().toString(); // Generate a unique session ID
        const token = jwt.sign({ id: user.id, sessionId }, JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict',
        });

        const successResponse: LoginResponse = { message: 'Logged in successfully' };
        res.json(successResponse);
    }

    passport.authenticate('local', localJwtLogin)(req, res, next);
};

export const verify: ExpressEndpoint = (req, res) => {
    const successResponse: VerifyResponse = { success: true };
    res.json(successResponse);
}