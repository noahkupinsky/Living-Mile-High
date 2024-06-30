import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { services } from '../app';
import { AdminModel } from '../models/AdminModel';

const adminService = () => services().adminService;

passport.use('local', new LocalStrategy(async (username, password, done) => {
    try {
        const user = await adminService().getUserByLoginInfo(username, password);
        if (!user) {
            return done(null, false, { message: `Invalid username or password ${await AdminModel.find({})}` });
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
        const user = await adminService().getUserById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

export default passport;