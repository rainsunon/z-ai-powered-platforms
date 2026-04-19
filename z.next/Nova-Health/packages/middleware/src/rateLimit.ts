import { Context, Next } from 'hono';
import { RateLimitError } from '@nova-health/types';

interface RateLimitStore {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitStore>();

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  keyGenerator?: (c: Context) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

export function rateLimit(config: RateLimitConfig) {
  const {
    windowMs,
    maxRequests,
    keyGenerator = (c) => {
      // Use IP address as default key
      return c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown';
    },
    skipSuccessfulRequests = false,
    skipFailedRequests = false,
  } = config;

  return async (c: Context, next: Next) => {
    const key = keyGenerator(c);
    const now = Date.now();

    // Clean up expired entries
    for (const [k, v] of rateLimitStore.entries()) {
      if (v.resetTime < now) {
        rateLimitStore.delete(k);
      }
    }

    // Get or create rate limit entry
    let entry = rateLimitStore.get(key);

    if (!entry || entry.resetTime < now) {
      entry = {
        count: 0,
        resetTime: now + windowMs,
      };
      rateLimitStore.set(key, entry);
    }

    // Check if limit exceeded
    if (entry.count >= maxRequests) {
      const resetTime = Math.ceil((entry.resetTime - now) / 1000);
      c.header('X-RateLimit-Limit', maxRequests.toString());
      c.header('X-RateLimit-Remaining', '0');
      c.header('X-RateLimit-Reset', resetTime.toString());
      c.header('Retry-After', resetTime.toString());

      throw new RateLimitError(
        `Too many requests. Please try again in ${resetTime} seconds.`
      );
    }

    // Increment counter
    entry.count++;

    // Add rate limit headers
    const remaining = maxRequests - entry.count;
    c.header('X-RateLimit-Limit', maxRequests.toString());
    c.header('X-RateLimit-Remaining', remaining.toString());
    c.header('X-RateLimit-Reset', Math.ceil((entry.resetTime - now) / 1000).toString());

    await next();

    // Skip counting based on response status
    const status = c.res.status;
    if (skipSuccessfulRequests && status >= 200 && status < 300) {
      entry.count--;
    } else if (skipFailedRequests && (status < 200 || status >= 400)) {
      entry.count--;
    }
  };
}

// Predefined rate limit configurations
export const rateLimits = {
  // General API rate limit
  api: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // 100 requests per 15 minutes
  }),

  // Strict rate limit for authentication endpoints
  auth: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 requests per 15 minutes
  }),

  // Moderate rate limit for data operations
  data: rateLimit({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30, // 30 requests per minute
  }),

  // Lenient rate limit for read-only operations
  read: rateLimit({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60, // 60 requests per minute
  }),
};
