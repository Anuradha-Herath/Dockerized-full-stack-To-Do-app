const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const securityMonitor = require('../security-monitor');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// @route   GET /auth/google
// @desc    Start Google OAuth
// @access  Public
router.get('/google', (req, res, next) => {
  // Generate CSRF token for state parameter
  const state = crypto.randomBytes(32).toString('hex');
  
  // Store state in session for verification
  req.session = req.session || {};
  req.session.oauthState = state;
  
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: state,
    accessType: 'offline', // Request refresh token
    prompt: 'consent' // Force consent screen to get refresh token
  })(req, res, next);
});

// @route   GET /auth/google/callback
// @desc    Google OAuth callback
// @access  Public
router.get('/google/callback', 
  (req, res, next) => {
    // Verify CSRF state parameter
    const state = req.query.state;
    const sessionState = req.session?.oauthState;
    
    if (!state || !sessionState || state !== sessionState) {
      securityMonitor.logSecurityEvent({
        type: 'csrf_attempt',
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        expectedState: sessionState,
        receivedState: state
      });
      const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3001';
      return res.redirect(`${frontendURL}/auth/google/callback?error=${encodeURIComponent('Invalid request - CSRF protection triggered')}`);
    }
    
    // Clear the state from session
    if (req.session) {
      delete req.session.oauthState;
    }
    
    next();
  },
  passport.authenticate('google', { session: false }),
  async (req, res) => {
    try {
      // Store refresh token if provided
      if (req.user && req.authInfo && req.authInfo.refreshToken) {
        await req.user.constructor.findByIdAndUpdate(req.user._id, {
          googleRefreshToken: req.authInfo.refreshToken,
          googleAccessToken: req.authInfo.accessToken,
          googleTokenExpiry: req.authInfo.expiry_date ? new Date(req.authInfo.expiry_date) : null
        });
      }
      
      // Generate JWT token
      const token = generateToken(req.user._id);
      
      // Redirect to frontend with token
      const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3001';
      res.redirect(`${frontendURL}/auth/google/callback?token=${token}`);
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3001';
      res.redirect(`${frontendURL}/auth/google/callback?error=${encodeURIComponent('Authentication failed')}`);
    }
  }
);

// @route   GET /auth/google/success
// @desc    Handle successful Google authentication
// @access  Public
router.get('/success', (req, res) => {
  const { token } = req.query;
  
  if (!token) {
    return res.status(400).json({ error: 'No token provided' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({
      message: 'Google authentication successful',
      token,
      userId: decoded.userId
    });
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
});

// @route   POST /auth/google/refresh
// @desc    Refresh Google OAuth token
// @access  Private
router.post('/google/refresh', require('../middleware/auth'), async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user || !user.googleRefreshToken) {
      return res.status(400).json({ error: 'No refresh token available' });
    }

    // Check if current access token is still valid
    if (user.googleTokenExpiry && user.googleTokenExpiry > new Date()) {
      return res.json({ 
        message: 'Token still valid',
        expiresIn: Math.floor((user.googleTokenExpiry - new Date()) / 1000)
      });
    }

    // Use Google OAuth2 client to refresh token
    const { OAuth2Client } = require('google-auth-library');
    const oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    oauth2Client.setCredentials({
      refresh_token: user.googleRefreshToken
    });

    const { tokens } = await oauth2Client.refreshAccessToken();
    
    // Update user with new tokens
    user.googleAccessToken = tokens.access_token;
    user.googleTokenExpiry = tokens.expiry_date ? new Date(tokens.expiry_date) : new Date(Date.now() + 3600000);
    if (tokens.refresh_token) {
      user.googleRefreshToken = tokens.refresh_token; // Google may provide new refresh token
    }
    await user.save();

    res.json({ 
      message: 'Token refreshed successfully',
      expiresIn: Math.floor((user.googleTokenExpiry - new Date()) / 1000)
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ error: 'Failed to refresh token' });
  }
});

module.exports = router;
