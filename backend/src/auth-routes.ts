import express from 'express';
import passport from './auth';

const router = express.Router();

// Auth check endpoint
router.get('/check', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// Google OAuth routes
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google-auth-failed`,
    successRedirect: process.env.FRONTEND_URL
  })
);

// Microsoft OAuth routes
router.get('/microsoft', passport.authenticate('microsoft', {
  scope: ['user.read']
}));

router.get('/microsoft/callback',
  passport.authenticate('microsoft', {
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=microsoft-auth-failed`,
    successRedirect: process.env.FRONTEND_URL
  })
);

// Logout route
router.post('/logout', (req, res) => {
  req.logout(() => {
    res.json({ success: true });
  });
});

export default router;
