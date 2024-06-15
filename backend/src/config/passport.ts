// passport.ts
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { getServices } from '../app';

passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const adminService = getServices().adminService;
        const user = await adminService.getUserByLoginInfo(username, password);
        if (!user) {
            return done(null, false, { message: 'Invalid username or password' });
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const adminService = getServices().adminService;
        const user = await adminService.getUserById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

export default passport;