import passport from 'passport';
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';

const MICROSOFT_CLIENT_ID = process.env.MICROSOFT_CLIENT_ID || '';
const MICROSOFT_CLIENT_SECRET = process.env.MICROSOFT_CLIENT_SECRET || '';

passport.use(new MicrosoftStrategy({
  clientID: MICROSOFT_CLIENT_ID,
  clientSecret: MICROSOFT_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/microsoft/callback',
  scope: ['user.read'],
}, async (accessToken: string, refreshToken: string, profile: any, done: (error: any, user?: any) => void) => {
  try {
    // Ensure stable ID
    profile.id = profile.id || profile.sub || profile.email || profile.emails?.[0]?.value;
    return done(null, profile);
  } catch (error) {
    return done(error);
  }
}));

export default passport;
