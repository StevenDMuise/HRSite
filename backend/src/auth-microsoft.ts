import passport from 'passport';
import { OIDCStrategy } from 'passport-azure-ad';

const MICROSOFT_CLIENT_ID = process.env.MICROSOFT_CLIENT_ID || '';
const MICROSOFT_CLIENT_SECRET = process.env.MICROSOFT_CLIENT_SECRET || '';
const MICROSOFT_TENANT_ID = process.env.MICROSOFT_TENANT_ID || 'common';

passport.use(new OIDCStrategy({
  identityMetadata: `https://login.microsoftonline.com/${MICROSOFT_TENANT_ID}/v2.0/.well-known/openid-configuration`,
  clientID: MICROSOFT_CLIENT_ID,
  clientSecret: MICROSOFT_CLIENT_SECRET,
  responseType: 'code',
  responseMode: 'query',
  redirectUrl: 'http://localhost:3000/auth/microsoft/callback',
  allowHttpForRedirectUrl: true,
  scope: ['profile', 'email', 'openid'],
  passReqToCallback: false,
}, (iss: any, sub: any, profile: any, accessToken: any, refreshToken: any, done: any) => {
  return done(null, profile);
}));

export default passport;
