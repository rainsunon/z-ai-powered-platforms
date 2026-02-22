import axios from 'axios';
import { getUserFromCache, setUserInCache } from '../utils/redis.js';
import { recordAuthServiceRequestDuration } from '../utils/metrics.js';
import { traceAsync } from '../utils/tracing.js';

/**
 * Middleware to protect routes by verifying JWT token with cache-first approach
 * Implements hybrid verification: check cache first, re-verify with auth service on critical ops
 */
const protect = async (req, res, next) => {
  try {
    // Check if authorization header exists
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 401,
        message: 'Not authorized to access this route',
      });
    }

    // Get token from header
    const token = authHeader.split(' ')[1];

    // Try to get user from cache first
    const cachedUser = await traceAsync('auth_cache_get', async () => {
      return await getUserFromCache(token);
    });

    if (cachedUser) {
      // Cache hit - use cached user data
      req.user = cachedUser;
      req.fromCache = true;
      return next();
    }

    // Cache miss - validate token with auth service
    const startTime = Date.now();
    try {
      const response = await traceAsync('auth_service_validate', async () => {
        return await axios.get(
          `${global.gConfig.auth_url}/api/auth/validate-token`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      });

      const duration = (Date.now() - startTime) / 1000;
      recordAuthServiceRequestDuration('validate-token', response.status, duration);

      // Set user info in request object
      req.user = response.data.user;
      req.fromCache = false;

      // Cache the user data for future requests
      await traceAsync('auth_cache_set', async () => {
        await setUserInCache(token, response.data.user);
      });

      next();
    } catch (error) {
      const duration = (Date.now() - startTime) / 1000;
      recordAuthServiceRequestDuration('validate-token', error.response?.status || 500, duration);

      if (error.response) {
        return res.status(error.response.status).json({
          status: error.response.status,
          message: error.response.data.message || 'Authentication failed',
        });
      }

      return res.status(401).json({
        status: 401,
        message: 'Authentication failed: ' + error.message,
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      status: 500,
      message: 'Internal server error',
    });
  }
};

/**
 * Middleware to restrict access based on user role
 * @param {string[]} roles - Array of allowed roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 401,
        message: 'Not authenticated',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 403,
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
    }

    next();
  };
};

/**
 * Validate user token with auth service (bypass cache)
 * For more rigorous validation, always calls auth service to validate token
 * Use this for critical operations like notification sends
 */
const validateWithAuthService = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Extract token from Bearer token
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
    }

    const startTime = Date.now();
    try {
      // Call auth service to validate token (bypass cache)
      const response = await traceAsync('auth_service_validate_critical', async () => {
        return await axios.get(
          `${
            process.env.AUTH_SERVICE_URL || 'http://localhost:5001'
          }/api/auth/validate-token`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      });

      const duration = (Date.now() - startTime) / 1000;
      recordAuthServiceRequestDuration('validate-token-critical', response.status, duration);

      // If valid, auth service will return user info
      if (response.data && response.data.success) {
        req.user = response.data.user;
        req.fromCache = false;
        next();
      } else {
        return res.status(401).json({
          success: false,
          message: 'Invalid authentication token',
        });
      }
    } catch (error) {
      const duration = (Date.now() - startTime) / 1000;
      recordAuthServiceRequestDuration('validate-token-critical', error.response?.status || 500, duration);

      // Handle auth service errors
      if (error.response) {
        // Auth service rejected the token
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired token',
        });
      }
      throw error; // Re-throw for other errors
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error in authentication',
    });
  }
};

/**
 * Re-verify user with auth service
 * Use this to re-verify user status on critical operations
 * This ensures data consistency even if cache is stale
 */
const reverifyUser = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        status: 401,
        message: 'User not authenticated',
      });
    }

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        status: 401,
        message: 'Token not provided',
      });
    }

    const startTime = Date.now();
    try {
      // Re-verify with auth service
      const response = await traceAsync('auth_service_reverify', async () => {
        return await axios.get(
          `${global.gConfig.auth_url}/api/auth/validate-token`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      });

      const duration = (Date.now() - startTime) / 1000;
      recordAuthServiceRequestDuration('reverify', response.status, duration);

      // Update user data from auth service
      req.user = response.data.user;
      req.fromCache = false;

      next();
    } catch (error) {
      const duration = (Date.now() - startTime) / 1000;
      recordAuthServiceRequestDuration('reverify', error.response?.status || 500, duration);

      if (error.response) {
        return res.status(error.response.status).json({
          status: error.response.status,
          message: 'Re-verification failed',
        });
      }

      return res.status(500).json({
        status: 500,
        message: 'Re-verification error',
      });
    }
  } catch (error) {
    console.error('Re-verification error:', error);
    return res.status(500).json({
      status: 500,
      message: 'Internal server error',
    });
  }
};

export { protect, authorize, validateWithAuthService, reverifyUser };
