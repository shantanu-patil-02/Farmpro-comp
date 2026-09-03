import jwt from 'jsonwebtoken';
import { User, inMemoryUsers } from '../models/User.js';
import { isDbConnected } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'farmpro_jwt_super_secret_key_2026_secure';
const JWT_EXPIRES_IN = '7d';

/**
 * Generate a signed JWT token for a user
 * @param {Object} user 
 * @returns {string} Signed JWT
 */
export function generateToken(user) {
  const payload = {
    id: user._id ? String(user._id) : String(user.id),
    email: user.email,
    role: user.role || 'farmer',
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Middleware to protect routes requiring authentication
 */
export async function protect(req, res, next) {
  let token = null;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.query && req.query.token) {
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required. No token provided.',
      isAuthError: true,
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // If MongoDB is connected, load fresh user from DB
    if (isDbConnected()) {
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'User belonging to this token no longer exists.',
          isAuthError: true,
        });
      }
      req.user = user;
      return next();
    }

    // In-memory fallback
    const memUser = inMemoryUsers.find(
      u => String(u._id) === String(decoded.id) || String(u.id) === String(decoded.id) || u.email === decoded.email
    );

    if (!memUser) {
      // If valid token structure for a demo session, provide a resilient safe user
      req.user = {
        _id: decoded.id,
        id: decoded.id,
        name: decoded.email?.split('@')[0] || 'Farmer',
        email: decoded.email,
        role: decoded.role || 'farmer',
        subscriptionPlan: 'free',
        freeRecommendationsUsed: 0,
      };
      return next();
    }

    const { password, ...safeUser } = memUser;
    req.user = safeUser;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Session expired. Please log in again.',
        isTokenExpired: true,
        isAuthError: true,
      });
    }

    return res.status(401).json({
      success: false,
      error: 'Invalid authentication token. Please log in again.',
      isAuthError: true,
    });
  }
}

/**
 * Optional authentication middleware: attaches user if token is present and valid,
 * but does not block unauthenticated requests.
 */
export async function optionalAuth(req, res, next) {
  let token = null;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (isDbConnected()) {
      const user = await User.findById(decoded.id).select('-password');
      req.user = user || null;
      return next();
    }

    const memUser = inMemoryUsers.find(
      u => String(u._id) === String(decoded.id) || String(u.id) === String(decoded.id) || u.email === decoded.email
    );

    if (memUser) {
      const { password, ...safeUser } = memUser;
      req.user = safeUser;
    } else {
      req.user = {
        _id: decoded.id,
        id: decoded.id,
        email: decoded.email,
        role: decoded.role || 'farmer',
      };
    }
    next();
  } catch (err) {
    // If token invalid in optional route, simply proceed as guest
    req.user = null;
    next();
  }
}

export default protect;
