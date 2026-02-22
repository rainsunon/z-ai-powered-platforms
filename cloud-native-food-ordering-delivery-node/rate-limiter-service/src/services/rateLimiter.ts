import { redis } from "../redis/client.js";
import { db } from "../db/index.js";
import { rateLimitRules } from "../db/schema.js";
import { eq } from "drizzle-orm";

const TOKEN_BUCKET_SCRIPT = `
  local key = KEYS[1]
  local capacity = tonumber(ARGV[1])
  local refill_rate = tonumber(ARGV[2]) -- tokens per second
  local now = tonumber(ARGV[3])
  local requested = tonumber(ARGV[4])

  local bucket = redis.call("HMGET", key, "tokens", "last_refill")
  local current_tokens = tonumber(bucket[1])
  local last_refill = tonumber(bucket[2])

  if not current_tokens then
    current_tokens = capacity
    last_refill = now
  end

  local elapsed = now - last_refill
  local new_tokens = math.min(capacity, current_tokens + (elapsed * refill_rate))
  
  if new_tokens < requested then
    local retry_after = (requested - new_tokens) / refill_rate
    return {0, new_tokens, retry_after} -- 0 means denied
  end

  new_tokens = new_tokens - requested
  redis.call("HMSET", key, "tokens", new_tokens, "last_refill", now)
  redis.call("EXPIRE", key, 3600) -- Expire after 1 hour inactivity

  return {1, new_tokens, 0} -- 1 means allowed
`;

interface RateLimitResult {
  allowed: boolean;
  remainingPoints: number;
  retryAfterMs?: number;
}

export class RateLimiterService {
  private ruleCache: Map<string, { rule: any; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 60000; // 1 minute cache for rules

  /**
   * Check if a request is allowed based on the rule for the key.
   * If the rule doesn't exist in Redis cache, fetches from DB.
   * @param key The identifier (e.g., "user:123")
   * @param cost Cost of the request (default 1)
   */
  async checkLimit(key: string, cost: number = 1): Promise<RateLimitResult> {
    // 1. Fetch rule from DB with in-memory caching
    let rule = this.getCachedRule(key);
    
    if (!rule) {
      rule = await db.query.rateLimitRules.findFirst({
          where: eq(rateLimitRules.key, key)
      });

      if (!rule) {
          // Fallback to global default rule
          rule = await db.query.rateLimitRules.findFirst({
              where: eq(rateLimitRules.key, "global_default")
          });

          if (!rule) {
              // Hardcoded default fallback
              rule = {
                  id: 0,
                  key: "default",
                  type: "TOKEN_BUCKET",
                  points: 10, // 10 requests
                  duration: 60, // per minute
                  createdAt: new Date(),
                  updatedAt: new Date()
              };
          }
      }
      
      this.setCachedRule(key, rule);
    }

    const { points: capacity, duration } = rule;
    const refillRate = capacity / duration; // tokens per second
    const now = Date.now() / 1000; // Unix timestamp in seconds

    // 2. Execute Lua Script
    const result = await redis.eval(
        TOKEN_BUCKET_SCRIPT,
        1,
        `rl:${key}`,
        capacity,
        refillRate,
        now,
        cost
    ) as [number, number, number];

    const [allowed, remaining, retryAfter] = result;

    return {
        allowed: allowed === 1,
        remainingPoints: Math.floor(remaining),
        retryAfterMs: allowed === 0 ? Math.ceil(retryAfter * 1000) : 0
    };
  }

  private getCachedRule(key: string): any | null {
    const cached = this.ruleCache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.rule;
    }
    return null;
  }

  private setCachedRule(key: string, rule: any): void {
    this.ruleCache.set(key, { rule, timestamp: Date.now() });
  }

  clearCache(): void {
    this.ruleCache.clear();
  }
}
