import { FastifyRequest, FastifyReply } from 'fastify';
import { RateLimitError } from '@cms/errors';
import { getCache } from '@cms/cache';

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyPrefix?: string;
  keyGenerator?: (request: FastifyRequest) => string;
  skipFailed?: boolean;
  skip?: (request: FastifyRequest) => boolean;
}

const defaultKeyGenerator = (request: FastifyRequest): string => {
  return request.ip ?? 'unknown';
};

export function createRateLimiter(config: RateLimitConfig) {
  const {
    windowMs,
    maxRequests,
    keyPrefix = 'rl',
    keyGenerator = defaultKeyGenerator,
    skip,
  } = config;

  return async function rateLimitMiddleware(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    if (skip?.(request)) return;

    const key = `${keyPrefix}:${keyGenerator(request)}`;
    const windowSeconds = Math.ceil(windowMs / 1000);

    try {
      const cache = getCache();
      const current = await cache.incr(key);

      if (current === 1) {
        await cache.expire(key, windowSeconds);
      }

      const ttl = await cache.ttl(key);
      const remaining = Math.max(0, maxRequests - current);

      reply.header('X-RateLimit-Limit', maxRequests);
      reply.header('X-RateLimit-Remaining', remaining);
      reply.header('X-RateLimit-Reset', Math.ceil(Date.now() / 1000) + ttl);

      if (current > maxRequests) {
        throw new RateLimitError(ttl);
      }
    } catch (err) {
      if (err instanceof RateLimitError) throw err;
      // If Redis is down, allow the request (fail-open)
    }
  };
}

// ─── Tenant-Specific Rate Limiter ───────────────────

export function createTenantRateLimiter(config: RateLimitConfig) {
  return createRateLimiter({
    ...config,
    keyPrefix: 'trl',
    keyGenerator: (request) => {
      const tenantId = request.headers['x-tenant-id'] as string;
      return tenantId ?? request.ip ?? 'unknown';
    },
  });
}

// ─── API Key Rate Limiter ───────────────────

export function createApiKeyRateLimiter(config: RateLimitConfig) {
  return createRateLimiter({
    ...config,
    keyPrefix: 'akrl',
    keyGenerator: (request) => {
      const apiKey = request.headers['x-api-key'] as string;
      return apiKey ?? request.ip ?? 'unknown';
    },
  });
}
