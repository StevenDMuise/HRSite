import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

// Replace with your Google OAuth credentials
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'GOOGLE_CLIENT_ID';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'GOOGLE_CLIENT_SECRET';


// Store a stable user ID on the session user object for DynamoDB partitioning
passport.serializeUser((user: any, done) => {
  // Google profile.id is stable, use as userId
  const sessionUser = {
    id: user.id || user.sub || user.email || user.emails?.[0]?.value,
    displayName: user.displayName,
    provider: user.provider,
    emails: user.emails,
    photos: user.photos,
  };
  done(null, sessionUser);
});
passport.deserializeUser((obj: any, done) => {
  done(null, obj);
});

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

export default passport;
