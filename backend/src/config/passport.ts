import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import bcrypt from 'bcrypt';

const MASTER_PASSWORD_HASH = process.env.MASTER_PASSWORD_HASH!;

passport.use(new LocalStrategy({
    passwordField: 'password'
}, async (password: string, done: any) => {
    console.log(password);
    const match = await bcrypt.compare(password, MASTER_PASSWORD_HASH);
    if (match) {
        return done(null, { id: 'master', role: 'admin' });
    } else {
        return done(null, false, { message: 'Invalid password' });
    }
}));

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: '/auth/google/callback'
}, async (token, tokenSecret, profile, done) => {
    const email = profile.emails![0].value;
    return done(null, { id: profile.id, email, role: 'google' });
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user: any, done) => {
    done(null, user);
});

export default passport;