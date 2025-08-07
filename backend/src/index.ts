

import express from 'express';
import session from 'express-session';
import passport from './auth';
import './auth-microsoft';
import applicationsRouter from './applications';


const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'devsecret',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', (_req, res) => {
  res.send('<h1>Application Tracker Backend</h1><p>API is running.</p>');
});


// Google OAuth routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/');
  }
);

// Microsoft OAuth routes
app.get('/auth/microsoft', passport.authenticate('azuread-openidconnect', { scope: ['profile', 'email', 'openid'] }));
app.get('/auth/microsoft/callback',
  passport.authenticate('azuread-openidconnect', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/');
  }
);

app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

function ensureAuthenticated(req: any, res: any, next: any) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: 'Unauthorized' });
}

app.use('/applications', ensureAuthenticated, applicationsRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
