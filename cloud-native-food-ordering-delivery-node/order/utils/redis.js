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
 * Get order data from cache
 * @param {string} orderId - Order ID
 * @returns {Promise<Object|null>} Order data or null if not found
 */
export const getOrderFromCache = async (orderId) => {
  try {
    const cacheKey = `order:${orderId}`;
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    return null;
  } catch (error) {
    console.error('Error getting order from cache:', error);
    return null;
  }
};

/**
 * Set order data in cache
 * @param {string} orderId - Order ID
 * @param {Object} orderData - Order data to cache
 * @returns {Promise<void>}
 */
export const setOrderInCache = async (orderId, orderData) => {
  try {
    const cacheKey = `order:${orderId}`;
    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(orderData));
  } catch (error) {
    console.error('Error setting order in cache:', error);
  }
};

/**
 * Invalidate order cache
 * @param {string} orderId - Order ID
 * @returns {Promise<void>}
 */
export const invalidateOrderCache = async (orderId) => {
  try {
    const cacheKey = `order:${orderId}`;
    await redis.del(cacheKey);
  } catch (error) {
    console.error('Error invalidating order cache:', error);
  }
};

/**
 * Get cart data from cache
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} Cart data or null if not found
 */
export const getCartFromCache = async (userId) => {
  try {
    const cacheKey = `cart:${userId}`;
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    return null;
  } catch (error) {
    console.error('Error getting cart from cache:', error);
    return null;
  }
};

/**
 * Set cart data in cache
 * @param {string} userId - User ID
 * @param {Object} cartData - Cart data to cache
 * @returns {Promise<void>}
 */
export const setCartInCache = async (userId, cartData) => {
  try {
    const cacheKey = `cart:${userId}`;
    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(cartData));
  } catch (error) {
    console.error('Error setting cart in cache:', error);
  }
};

/**
 * Invalidate cart cache
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
export const invalidateCartCache = async (userId) => {
  try {
    const cacheKey = `cart:${userId}`;
    await redis.del(cacheKey);
  } catch (error) {
    console.error('Error invalidating cart cache:', error);
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
