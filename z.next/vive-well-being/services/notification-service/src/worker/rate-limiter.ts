import Redis from "ioredis";
import { env } from "../config/env.js";
import { logger } from "../lib/logger.js";

const redis = new Redis(env.REDIS_URL);

/**
 * Redis-based sliding-window rate limiter.
 * Returns true if the user is within the limit, false if rate-limited.
 */
export async function checkRateLimit(userId: string): Promise<boolean> {
  const key = `rate:notif:${userId}`;
  const now = Date.now();
  const windowMs = 60_000; // 1 minute

  // Remove expired entries
  await redis.zremrangebyscore(key, 0, now - windowMs);

  // Count current entries
  const count = await redis.zcard(key);

  if (count >= env.RATE_LIMIT_PER_MINUTE) {
    return false;
  }

  // Add current timestamp
  await redis.zadd(key, now, `${now}`);
  await redis.expire(key, 60);

  return true;
}

export async function disconnectRedis(): Promise<void> {
  await redis.quit();
}
