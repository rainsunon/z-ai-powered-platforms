import Redis from 'ioredis';

// Initialize Redis client
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Cache TTL (5 minutes for user data)
const CACHE_TTL = 300; // 5 minutes in seconds

// Error handling
redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

redis.on('connect', () => {
  console.log('Redis connected successfully');
});

/**
 * Get user data from cache
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} User data or null if not found
 */
export const getUserFromCache = async (userId) => {
  try {
    const cacheKey = `user:${userId}`;
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    return null;
  } catch (error) {
    console.error('Error getting user from cache:', error);
    return null;
  }
};

/**
 * Set user data in cache
 * @param {string} userId - User ID
 * @param {Object} userData - User data to cache
 * @returns {Promise<void>}
 */
export const setUserInCache = async (userId, userData) => {
  try {
    const cacheKey = `user:${userId}`;
    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(userData));
  } catch (error) {
    console.error('Error setting user in cache:', error);
  }
};

/**
 * Invalidate user cache
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
export const invalidateUserCache = async (userId) => {
  try {
    const cacheKey = `user:${userId}`;
    await redis.del(cacheKey);
  } catch (error) {
    console.error('Error invalidating user cache:', error);
  }
};

/**
 * Get payment data from cache
 * @param {string} paymentId - Payment ID
 * @returns {Promise<Object|null>} Payment data or null if not found
 */
export const getPaymentFromCache = async (paymentId) => {
  try {
    const cacheKey = `payment:${paymentId}`;
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    return null;
  } catch (error) {
    console.error('Error getting payment from cache:', error);
    return null;
  }
};

/**
 * Set payment data in cache
 * @param {string} paymentId - Payment ID
 * @param {Object} paymentData - Payment data to cache
 * @returns {Promise<void>}
 */
export const setPaymentInCache = async (paymentId, paymentData) => {
  try {
    const cacheKey = `payment:${paymentId}`;
    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(paymentData));
  } catch (error) {
    console.error('Error setting payment in cache:', error);
  }
};

/**
 * Invalidate payment cache
 * @param {string} paymentId - Payment ID
 * @returns {Promise<void>}
 */
export const invalidatePaymentCache = async (paymentId) => {
  try {
    const cacheKey = `payment:${paymentId}`;
    await redis.del(cacheKey);
  } catch (error) {
    console.error('Error invalidating payment cache:', error);
  }
};

/**
 * Get cache statistics
 * @returns {Promise<Object>} Cache statistics
 */
export const getCacheStats = async () => {
  try {
    const info = await redis.info('stats');
    const keyspace = await redis.info('keyspace');
    return {
      stats: info,
      keyspace: keyspace,
    };
  } catch (error) {
    console.error('Error getting cache stats:', error);
    return null;
  }
};

/**
 * Clear all cache (use with caution)
 * @returns {Promise<void>}
 */
export const clearAllCache = async () => {
  try {
    await redis.flushall();
    console.log('All cache cleared');
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};

/**
 * Close Redis connection
 * @returns {Promise<void>}
 */
export const closeRedisConnection = async () => {
  try {
    await redis.quit();
    console.log('Redis connection closed');
  } catch (error) {
    console.error('Error closing Redis connection:', error);
  }
};

export default redis;
