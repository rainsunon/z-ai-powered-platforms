import redis from 'redis';

/**
 * Redis utility for token blacklist and user caching
 */
class RedisClient {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  /**
   * Initialize Redis connection
   */
  async connect() {
    if (this.isConnected) {
      return this.client;
    }

    this.client = redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      socket: {
        reconnectStrategy: 'reconnect',
        reconnectDelay: 100,
      },
    });

    this.client.on('error', (err) => {
      console.error('Redis Client Error:', err);
      this.isConnected = false;
    });

    this.client.on('connect', () => {
      console.log('✅ Redis Client Connected');
      this.isConnected = true;
    });

    this.client.on('disconnect', () => {
      console.log('⚠️  Redis Client Disconnected');
      this.isConnected = false;
    });

    await this.client.connect();
    return this.client;
  }

  /**
   * Get Redis client (lazy initialization)
   */
  async getClient() {
    if (!this.client || !this.isConnected) {
      await this.connect();
    }
    return this.client;
  }

  /**
   * Add token to blacklist
   * @param {string} token - JWT token to blacklist
   * @param {number} ttl - Time to live in seconds (default: token expiration)
   */
  async blacklistToken(token, ttl = null) {
    try {
      const client = await this.getClient();
      const key = `blacklist:${token}`;
      
      if (ttl) {
        await client.setEx(key, '1', 'EX', ttl);
      } else {
        await client.set(key, '1');
      }
      
      console.log(`✅ Token blacklisted: ${token.substring(0, 20)}...`);
      return true;
    } catch (error) {
      console.error('Error blacklisting token:', error);
      return false;
    }
  }

  /**
   * Check if token is blacklisted
   * @param {string} token - JWT token to check
   * @returns {boolean} Whether token is blacklisted
   */
  async isTokenBlacklisted(token) {
    try {
      const client = await this.getClient();
      const key = `blacklist:${token}`;
      const result = await client.get(key);
      return result === '1';
    } catch (error) {
      console.error('Error checking token blacklist:', error);
      return false;
    }
  }

  /**
   * Remove token from blacklist
   * @param {string} token - JWT token to remove
   */
  async removeTokenFromBlacklist(token) {
    try {
      const client = await this.getClient();
      const key = `blacklist:${token}`;
      await client.del(key);
      console.log(`✅ Token removed from blacklist: ${token.substring(0, 20)}...`);
      return true;
    } catch (error) {
      console.error('Error removing token from blacklist:', error);
      return false;
    }
  }

  /**
   * Cache user data
   * @param {string} userId - User ID
   * @param {Object} userData - User data to cache
   * @param {number} ttl - Time to live in seconds (default: 5 minutes)
   */
  async cacheUser(userId, userData, ttl = 300) {
    try {
      const client = await this.getClient();
      const key = `user:${userId}`;
      const data = JSON.stringify(userData);
      
      await client.setEx(key, data, 'EX', ttl);
      console.log(`✅ User cached: ${userId}`);
      return true;
    } catch (error) {
      console.error('Error caching user:', error);
      return false;
    }
  }

  /**
   * Get cached user data
   * @param {string} userId - User ID
   * @returns {Object|null} Cached user data
   */
  async getCachedUser(userId) {
    try {
      const client = await this.getClient();
      const key = `user:${userId}`;
      const data = await client.get(key);
      
      if (data) {
        return JSON.parse(data);
      }
      
      return null;
    } catch (error) {
      console.error('Error getting cached user:', error);
      return null;
    }
  }

  /**
   * Invalidate user cache
   * @param {string} userId - User ID
   */
  async invalidateUserCache(userId) {
    try {
      const client = await this.getClient();
      const key = `user:${userId}`;
      await client.del(key);
      console.log(`✅ User cache invalidated: ${userId}`);
      return true;
    } catch (error) {
      console.error('Error invalidating user cache:', error);
      return false;
    }
  }

  /**
   * Cache OTP
   * @param {string} email - User email
   * @param {string} otp - OTP code
   * @param {number} ttl - Time to live in seconds (default: 5 minutes)
   */
  async cacheOTP(email, otp, ttl = 300) {
    try {
      const client = await this.getClient();
      const key = `otp:${email}`;
      
      await client.setEx(key, otp, 'EX', ttl);
      console.log(`✅ OTP cached for ${email}`);
      return true;
    } catch (error) {
      console.error('Error caching OTP:', error);
      return false;
    }
  }

  /**
   * Get cached OTP
   * @param {string} email - User email
   * @returns {string|null} Cached OTP
   */
  async getCachedOTP(email) {
    try {
      const client = await this.getClient();
      const key = `otp:${email}`;
      const otp = await client.get(key);
      
      return otp || null;
    } catch (error) {
      console.error('Error getting cached OTP:', error);
      return null;
    }
  }

  /**
   * Delete cached OTP
   * @param {string} email - User email
   */
  async deleteCachedOTP(email) {
    try {
      const client = await this.getClient();
      const key = `otp:${email}`;
      await client.del(key);
      console.log(`✅ OTP deleted for ${email}`);
      return true;
    } catch (error) {
      console.error('Error deleting cached OTP:', error);
      return false;
    }
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache statistics
   */
  async getCacheStats() {
    try {
      const client = await this.getClient();
      
      const blacklistKeys = await client.keys('blacklist:*');
      const userCacheKeys = await client.keys('user:*');
      const otpKeys = await client.keys('otp:*');
      
      return {
        blacklistedTokens: blacklistKeys.length,
        cachedUsers: userCacheKeys.length,
        cachedOTPs: otpKeys.length,
        totalKeys: blacklistKeys.length + userCacheKeys.length + otpKeys.length,
      };
    } catch (error) {
      console.error('Error getting cache stats:', error);
      return {
        blacklistedTokens: 0,
        cachedUsers: 0,
        cachedOTPs: 0,
        totalKeys: 0,
      };
    }
  }

  /**
   * Clear all cache
   * @returns {boolean} Success status
   */
  async clearAllCache() {
    try {
      const client = await this.getClient();
      
      // Get all keys
      const keys = await client.keys('*');
      
      if (keys.length > 0) {
        await client.del(...keys);
        console.log(`✅ Cleared ${keys.length} cache keys`);
      }
      
      return true;
    } catch (error) {
      console.error('Error clearing cache:', error);
      return false;
    }
  }

  /**
   * Close Redis connection
   */
  async disconnect() {
    if (this.client && this.isConnected) {
      await this.client.quit();
      this.isConnected = false;
      console.log('✅ Redis Client Disconnected');
    }
  }
}

// Export singleton instance
const redisClient = new RedisClient();

export default redisClient;
