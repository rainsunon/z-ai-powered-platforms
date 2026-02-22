import rateLimit from 'express-rate-limit';
import { Histogram, Counter } from 'prom-client';

// Prometheus metrics for rate limiting
export const rateLimitHits = new Counter({
  name: 'rate_limit_hits_total',
  help: 'Total number of rate limit hits',
  labelNames: ['route', 'identifier'],
});

export const rateLimitBlocked = new Counter({
  name: 'rate_limit_blocked_total',
  help: 'Total number of requests blocked by rate limit',
  labelNames: ['route', 'identifier'],
});

export const rateLimitRemaining = new Histogram({
  name: 'rate_limit_remaining',
  help: 'Remaining requests in rate limit window',
  labelNames: ['route', 'identifier'],
  buckets: [0, 5, 10, 25, 50, 100, 250, 500],
});

/**
 * Create rate limiter middleware with Redis backend
 * @param {Object} redisClient - Redis client instance
 * @returns {Function} Express middleware
 */
export const createRateLimiter = (redisClient) => {
  // Rate limit rules for different endpoints
  const rateLimitRules = {
    // Auth endpoints - stricter limits
    '/api/auth/login': {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5, // 5 attempts
      skipSuccessfulRequests: false,
    },
    '/api/auth/register': {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 3, // 3 attempts
      skipSuccessfulRequests: false,
    },
    '/api/auth/send-otp': {
      windowMs: 60 * 1000, // 1 minute
      max: 3, // 3 attempts
      skipSuccessfulRequests: false,
    },
    '/api/auth/verify-otp': {
      windowMs: 5 * 60 * 1000, // 5 minutes
      max: 10, // 10 attempts
      skipSuccessfulRequests: false,
    },
    
    // API endpoints - moderate limits
    '/api/orders': {
      windowMs: 60 * 1000, // 1 minute
      max: 100, // 100 requests
      skipSuccessfulRequests: true,
    },
    '/api/restaurants': {
      windowMs: 60 * 1000, // 1 minute
      max: 100, // 100 requests
      skipSuccessfulRequests: true,
    },
    '/api/payments': {
      windowMs: 60 * 1000, // 1 minute
      max: 50, // 50 requests
      skipSuccessfulRequests: true,
    },
    '/api/notifications': {
      windowMs: 60 * 1000, // 1 minute
      max: 100, // 100 requests
      skipSuccessfulRequests: true,
    },
    '/api/deliveries': {
      windowMs: 60 * 1000, // 1 minute
      max: 100, // 100 requests
      skipSuccessfulRequests: true,
    },
    '/api/admin': {
      windowMs: 60 * 1000, // 1 minute
      max: 100, // 100 requests
      skipSuccessfulRequests: true,
    },
  };

  // Default rate limit for unmatched routes
  const defaultLimit = {
    windowMs: 60 * 1000, // 1 minute
    max: 60, // 60 requests
    skipSuccessfulRequests: true,
  };

  return async (req, res, next) => {
    // Find matching rate limit rule
    let matchedRule = null;
    for (const [path, rule] of Object.entries(rateLimitRules)) {
      if (req.path.startsWith(path)) {
        matchedRule = rule;
        break;
      }
    }

    const rule = matchedRule || defaultLimit;
    const identifier = req.ip || req.headers['x-forwarded-for'] || 'unknown';

    // Create rate limiter for this request
    const limiter = rateLimit({
      windowMs: rule.windowMs,
      max: rule.max,
      message: {
        success: false,
        message: `Too many requests. Please try again later.`,
        retryAfter: Math.ceil(rule.windowMs / 1000),
      },
      standardHeaders: true,
      legacyHeaders: false,
      skipSuccessfulRequests: rule.skipSuccessfulRequests,
      keyGenerator: (req) => {
        // Use IP + path as key for more granular rate limiting
        return `${identifier}:${req.path}`;
      },
      handler: (req, res) => {
        // Record metrics
        rateLimitBlocked.inc({
          route: req.path,
          identifier: identifier,
        });

        res.status(429).json({
          success: false,
          message: `Too many requests. Maximum ${rule.max} requests per ${rule.windowMs / 1000} seconds.`,
          retryAfter: Math.ceil(rule.windowMs / 1000),
        });
      },
      onLimitReached: (req, res, options) => {
        // Record metrics
        rateLimitHits.inc({
          route: req.path,
          identifier: identifier,
        });

        console.log(`Rate limit reached for ${identifier} on ${req.path}`);
      },
    });

    // Apply the limiter
    limiter(req, res, next);
  };
};

/**
 * Get rate limit status for a specific route
 * @param {string} route - Route path
 * @returns {Object} Rate limit configuration
 */
export const getRateLimitStatus = (route) => {
  const rateLimitRules = {
    '/api/auth/login': { window: '15 minutes', max: 5 },
    '/api/auth/register': { window: '1 hour', max: 3 },
    '/api/auth/send-otp': { window: '1 minute', max: 3 },
    '/api/auth/verify-otp': { window: '5 minutes', max: 10 },
    '/api/orders': { window: '1 minute', max: 100 },
    '/api/restaurants': { window: '1 minute', max: 100 },
    '/api/payments': { window: '1 minute', max: 50 },
    '/api/notifications': { window: '1 minute', max: 100 },
    '/api/deliveries': { window: '1 minute', max: 100 },
    '/api/admin': { window: '1 minute', max: 100 },
  };

  return rateLimitRules[route] || { window: '1 minute', max: 60 };
};

export default createRateLimiter;
