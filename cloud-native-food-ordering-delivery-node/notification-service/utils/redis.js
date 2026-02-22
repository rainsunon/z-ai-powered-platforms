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
 * Get notification data from cache
 * @param {string} notificationId - Notification ID
 * @returns {Promise<Object|null>} Notification data or null if not found
 */
export const getNotificationFromCache = async (notificationId) => {
  try {
    const cacheKey = `notification:${notificationId}`;
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    return null;
  } catch (error) {
    console.error('Error getting notification from cache:', error);
    return null;
  }
};

/**
 * Set notification data in cache
 * @param {string} notificationId - Notification ID
 * @param {Object} notificationData - Notification data to cache
 * @returns {Promise<void>}
 */
export const setNotificationInCache = async (notificationId, notificationData) => {
  try {
    const cacheKey = `notification:${notificationId}`;
    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(notificationData));
  } catch (error) {
    console.error('Error setting notification in cache:', error);
  }
};

/**
 * Invalidate notification cache
 * @param {string} notificationId - Notification ID
 * @returns {Promise<void>}
 */
export const invalidateNotificationCache = async (notificationId) => {
  try {
    const cacheKey = `notification:${notificationId}`;
    await redis.del(cacheKey);
  } catch (error) {
    console.error('Error invalidating notification cache:', error);
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
