/**
 * Rate Limiter Manager
 * Manages rate limiting using Redis for token buckets and PostgreSQL for rules
 */

export class RateLimiterManager {
  constructor(pool, redisClient) {
    this.pool = pool;
    this.redis = redisClient;
  }

  /**
   * Check if request should be rate limited
   * @param {string} identifier - Unique identifier (IP, user ID, etc.)
   * @param {string} route - Route path
   * @returns {Object} Rate limit result
   */
  async checkRateLimit(identifier, route) {
    try {
      // Get rate limit rule for this route
      const rule = await this.getRule(route);
      
      if (!rule) {
        // Default rule if no specific rule found
        return {
          allowed: true,
          remaining: 999,
          reset: Date.now() + 60000,
        };
      }

      const key = `ratelimit:${identifier}:${route}`;
      const now = Date.now();
      const windowStart = now - rule.window_ms;

      // Get current request count from Redis
      const count = await this.redis.incr(key);
      
      // Set expiration if this is the first request in the window
      if (count === 1) {
        await this.redis.expire(key, Math.ceil(rule.window_ms / 1000));
      }

      const remaining = Math.max(0, rule.max_requests - count);
      const allowed = count <= rule.max_requests;

      // Log request
      await this.logRequest(identifier, route, allowed);

      return {
        allowed,
        remaining,
        reset: windowStart + rule.window_ms,
        retryAfter: Math.ceil(rule.window_ms / 1000),
      };
    } catch (error) {
      console.error('Error checking rate limit:', error);
      throw error;
    }
  }

  /**
   * Get rate limit rule for a route
   * @param {string} route - Route path
   * @returns {Object|null} Rate limit rule
   */
  async getRule(route) {
    try {
      // Find matching rule (supports prefix matching)
      const result = await this.pool.query(
        `SELECT * FROM rate_limit_rules 
         WHERE $1 LIKE route || '%' 
         ORDER BY LENGTH(route) DESC 
         LIMIT 1`,
        [route]
      );

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error getting rate limit rule:', error);
      return null;
    }
  }

  /**
   * Get all rate limit rules
   * @returns {Array} All rules
   */
  async getAllRules() {
    try {
      const result = await this.pool.query(
        'SELECT * FROM rate_limit_rules ORDER BY route'
      );
      return result.rows;
    } catch (error) {
      console.error('Error getting all rules:', error);
      throw error;
    }
  }

  /**
   * Get active rules count
   * @returns {number} Number of active rules
   */
  async getActiveRulesCount() {
    try {
      const result = await this.pool.query(
        'SELECT COUNT(*) as count FROM rate_limit_rules'
      );
      return parseInt(result.rows[0].count);
    } catch (error) {
      console.error('Error getting active rules count:', error);
      return 0;
    }
  }

  /**
   * Upsert rate limit rule
   * @param {string} route - Route path
   * @param {number} windowMs - Window duration in milliseconds
   * @param {number} maxRequests - Maximum requests allowed
   */
  async upsertRule(route, windowMs, maxRequests) {
    try {
      await this.pool.query(
        `INSERT INTO rate_limit_rules (route, window_ms, max_requests)
         VALUES ($1, $2, $3)
         ON CONFLICT (route) DO UPDATE SET
           window_ms = EXCLUDED.window_ms,
           max_requests = EXCLUDED.max_requests,
           updated_at = CURRENT_TIMESTAMP`,
        [route, windowMs, maxRequests]
      );

      // Clear Redis cache for this route to apply new rules
      const keys = await this.redis.keys(`ratelimit:*:${route}`);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }

      console.log(`✅ Rate limit rule updated for ${route}`);
    } catch (error) {
      console.error('Error upserting rule:', error);
      throw error;
    }
  }

  /**
   * Delete rate limit rule
   * @param {string} route - Route path
   */
  async deleteRule(route) {
    try {
      await this.pool.query(
        'DELETE FROM rate_limit_rules WHERE route = $1',
        [route]
      );

      // Clear Redis cache for this route
      const keys = await this.redis.keys(`ratelimit:*:${route}`);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }

      console.log(`✅ Rate limit rule deleted for ${route}`);
    } catch (error) {
      console.error('Error deleting rule:', error);
      throw error;
    }
  }

  /**
   * Reset rate limit for an identifier
   * @param {string} identifier - Unique identifier
   * @param {string} route - Route path
   */
  async resetRateLimit(identifier, route) {
    try {
      const key = `ratelimit:${identifier}:${route}`;
      await this.redis.del(key);
      console.log(`✅ Rate limit reset for ${identifier} on ${route}`);
    } catch (error) {
      console.error('Error resetting rate limit:', error);
      throw error;
    }
  }

  /**
   * Get status for an identifier
   * @param {string} identifier - Unique identifier
   * @returns {Object} Status information
   */
  async getStatus(identifier) {
    try {
      // Get all rate limit keys for this identifier
      const keys = await this.redis.keys(`ratelimit:${identifier}:*`);
      
      const status = {
        identifier,
        routes: [],
      };

      for (const key of keys) {
        const route = key.split(':')[2];
        const count = await this.redis.get(key);
        const ttl = await this.redis.ttl(key);
        
        const rule = await this.getRule(route);
        
        status.routes.push({
          route,
          requests: parseInt(count) || 0,
          max: rule ? rule.max_requests : 60,
          remaining: Math.max(0, (rule ? rule.max_requests : 60) - parseInt(count)),
          resetIn: ttl > 0 ? ttl : 0,
        });
      }

      return status;
    } catch (error) {
      console.error('Error getting status:', error);
      throw error;
    }
  }

  /**
   * Get total requests count
   * @returns {number} Total requests count
   */
  async getTotalRequestsCount() {
    try {
      const result = await this.pool.query(
        'SELECT COUNT(*) as count FROM request_logs WHERE created_at > NOW() - INTERVAL \'1 hour\''
      );
      return parseInt(result.rows[0].count);
    } catch (error) {
      console.error('Error getting total requests count:', error);
      return 0;
    }
  }

  /**
   * Log request to database
   * @param {string} identifier - Unique identifier
   * @param {string} route - Route path
   * @param {boolean} allowed - Whether request was allowed
   */
  async logRequest(identifier, route, allowed) {
    try {
      await this.pool.query(
        'INSERT INTO request_logs (identifier, route, allowed) VALUES ($1, $2, $3)',
        [identifier, route, allowed]
      );
    } catch (error) {
      console.error('Error logging request:', error);
      // Don't throw error, logging should not block requests
    }
  }

  /**
   * Cleanup old request logs (run periodically)
   * @param {number} days - Number of days to keep logs
   */
  async cleanupOldLogs(days = 7) {
    try {
      const result = await this.pool.query(
        'DELETE FROM request_logs WHERE created_at < NOW() - INTERVAL $1 DAY',
        [days]
      );
      console.log(`✅ Cleaned up ${result.rowCount} old request logs`);
      return result.rowCount;
    } catch (error) {
      console.error('Error cleaning up logs:', error);
      throw error;
    }
  }

  /**
   * Get statistics
   * @returns {Object} Statistics
   */
  async getStatistics() {
    try {
      // Total requests in last hour
      const totalRequests = await this.pool.query(
        'SELECT COUNT(*) as count FROM request_logs WHERE created_at > NOW() - INTERVAL \'1 hour\''
      );

      // Blocked requests in last hour
      const blockedRequests = await this.pool.query(
        'SELECT COUNT(*) as count FROM request_logs WHERE created_at > NOW() - INTERVAL \'1 hour\' AND allowed = false'
      );

      // Most active routes
      const activeRoutes = await this.pool.query(
        'SELECT route, COUNT(*) as count FROM request_logs 
         WHERE created_at > NOW() - INTERVAL \'1 hour\' 
         GROUP BY route 
         ORDER BY count DESC 
         LIMIT 10'
      );

      // Top blocked identifiers
      const topBlocked = await this.pool.query(
        'SELECT identifier, COUNT(*) as count FROM request_logs 
         WHERE created_at > NOW() - INTERVAL \'1 hour\' AND allowed = false 
         GROUP BY identifier 
         ORDER BY count DESC 
         LIMIT 10'
      );

      return {
        totalRequestsLastHour: parseInt(totalRequests.rows[0].count),
        blockedRequestsLastHour: parseInt(blockedRequests.rows[0].count),
        activeRoutes: activeRoutes.rows,
        topBlockedIdentifiers: topBlocked.rows,
        activeRules: await this.getActiveRulesCount(),
      };
    } catch (error) {
      console.error('Error getting statistics:', error);
      throw error;
    }
  }
}

export default RateLimiterManager;
