const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Helper to build cookie options based on env configuration
 */
const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';

  // COOKIE_SAMESITE: 'lax', 'none', or 'strict'
  let sameSite = process.env.COOKIE_SAMESITE ? process.env.COOKIE_SAMESITE.toLowerCase() : null;
  // COOKIE_SECURE: 'true' or 'false'
  let secure = process.env.COOKIE_SECURE !== undefined
    ? process.env.COOKIE_SECURE === 'true'
    : isProduction;

  // Default fallback:
  // - Cross-origin testing on separate domains (e.g. vercel.app and onrender.com) -> 'none' + secure
  // - Same origin / shared domain (e.g. suyogjewelry.com) or local dev -> 'lax'
  if (!sameSite) {
    sameSite = isProduction ? 'none' : 'lax';
  }

  // Browser standard: SameSite=None requires Secure=true
  if (sameSite === 'none') {
    secure = true;
  }

  return {
    httpOnly: true,
    secure,
    sameSite,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  };
};

/**
 * Generate JWT token and set as httpOnly cookie
 */
const generateTokenAndSetCookie = (user, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });

  const cookieOptions = getCookieOptions();
  res.cookie('jwt', token, cookieOptions);
  return token;
};

/**
 * @desc    Login admin
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user with password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate token
    generateTokenAndSetCookie(user, res);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during login',
    });
  }
};

/**
 * @desc    Logout admin (clear cookie)
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = async (req, res) => {
  const cookieOptions = getCookieOptions();
  res.cookie('jwt', '', {
    ...cookieOptions,
    expires: new Date(0),
    maxAge: 0,
  });

  res.json({
    success: true,
    message: 'Logged out successfully',
  });
};

/**
 * @desc    Get current logged-in user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res) => {
  res.json({
    success: true,
    data: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
};

module.exports = { login, logout, getMe };
