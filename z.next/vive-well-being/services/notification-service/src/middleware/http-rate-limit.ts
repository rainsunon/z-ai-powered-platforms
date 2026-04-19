import type { Context, Next } from "hono";
import Redis from "ioredis";
import { env } from "../config/env.js";

const redis = new Redis(env.REDIS_URL);

/**
 * HTTP-level sliding-window rate limiter.
 * Uses the API key as the rate-limit identity.
 * Limits to HTTP_RATE_LIMIT_PER_MINUTE requests per minute.
 */
export async function httpRateLimit(c: Context, next: Next) {
  // Skip for health checks
  if (c.req.path === "/health") {
    return next();
  }

  const identity = c.req.header("x-api-key") ?? c.req.header("x-forwarded-for") ?? "anonymous";
  const key = `rate:http:${identity}`;
  const now = Date.now();
  const windowMs = 60_000;

  await redis.zremrangebyscore(key, 0, now - windowMs);
  const count = await redis.zcard(key);

  if (count >= env.HTTP_RATE_LIMIT_PER_MINUTE) {
    c.header("Retry-After", "60");
    return c.json({ error: "Too many requests" }, 429);
  }

  await redis.zadd(key, now, `${now}-${Math.random()}`);
  await redis.expire(key, 60);

  c.header("X-RateLimit-Limit", String(env.HTTP_RATE_LIMIT_PER_MINUTE));
  c.header("X-RateLimit-Remaining", String(env.HTTP_RATE_LIMIT_PER_MINUTE - count - 1));

  await next();
}
