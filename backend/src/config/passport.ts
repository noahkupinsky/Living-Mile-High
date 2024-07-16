import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { services } from '~/di';

const adminService = () => services().adminService;

passport.use('local', new LocalStrategy(async (username, password, done) => {
    try {
        const user = await adminService().getUserByLoginInfo(username, password);
        if (!user) {
            return done(null, false, { message: `Invalid username or password` });
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

// No need for serializeUser and deserializeUser as we are using JWT for session management

export default passport;