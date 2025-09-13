const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

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
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// @route   GET /auth/google/callback
// @desc    Google OAuth callback
// @access  Public
router.get('/google/callback', 
  passport.authenticate('google', { session: false }),
  async (req, res) => {
    try {
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

module.exports = router;
