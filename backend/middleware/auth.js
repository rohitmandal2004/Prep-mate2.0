const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      if (!req.user.isActive) {
        return res.status(401).json({ message: 'User account is deactivated' });
      }

      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// Optional auth - verify token if provided but don't require it
const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // Token is invalid, but we don't fail the request
      req.user = null;
    }
  }

  next();
};

// Check if user is admin
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
};

// Check if user is employer/recruiter
const employer = (req, res, next) => {
  if (req.user && (req.user.role === 'employer' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Employer role required.' });
  }
};

// Check if user owns the resource or is admin
const authorize = (resourceUserId) => {
  return (req, res, next) => {
    if (req.user.role === 'admin') {
      return next();
    }

    if (req.user._id.toString() === resourceUserId.toString()) {
      return next();
    }

    res.status(403).json({ message: 'Access denied. You can only modify your own resources.' });
  };
};

// Rate limiting for authentication attempts
const authRateLimit = (req, res, next) => {
  // This would typically be implemented with a rate limiting library
  // For now, we'll just pass through
  next();
};

// Validate JWT token without requiring user to exist
const validateToken = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Check if token is expired
      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        return res.status(401).json({ message: 'Token expired' });
      }

      req.tokenData = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  } else {
    return res.status(401).json({ message: 'No token provided' });
  }
};

module.exports = {
  protect,
  optionalAuth,
  admin,
  employer,
  authorize,
  authRateLimit,
  validateToken
};
