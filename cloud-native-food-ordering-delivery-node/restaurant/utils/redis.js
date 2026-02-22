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
 * Get restaurant data from cache
 * @param {string} restaurantId - Restaurant ID
 * @returns {Promise<Object|null>} Restaurant data or null if not found
 */
export const getRestaurantFromCache = async (restaurantId) => {
  try {
    const cacheKey = `restaurant:${restaurantId}`;
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    return null;
  } catch (error) {
    console.error('Error getting restaurant from cache:', error);
    return null;
  }
};

/**
 * Set restaurant data in cache
 * @param {string} restaurantId - Restaurant ID
 * @param {Object} restaurantData - Restaurant data to cache
 * @returns {Promise<void>}
 */
export const setRestaurantInCache = async (restaurantId, restaurantData) => {
  try {
    const cacheKey = `restaurant:${restaurantId}`;
    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(restaurantData));
  } catch (error) {
    console.error('Error setting restaurant in cache:', error);
  }
};

/**
 * Invalidate restaurant cache
 * @param {string} restaurantId - Restaurant ID
 * @returns {Promise<void>}
 */
export const invalidateRestaurantCache = async (restaurantId) => {
  try {
    const cacheKey = `restaurant:${restaurantId}`;
    await redis.del(cacheKey);
  } catch (error) {
    console.error('Error invalidating restaurant cache:', error);
  }
};

/**
 * Get dish data from cache
 * @param {string} dishId - Dish ID
 * @returns {Promise<Object|null>} Dish data or null if not found
 */
export const getDishFromCache = async (dishId) => {
  try {
    const cacheKey = `dish:${dishId}`;
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    return null;
  } catch (error) {
    console.error('Error getting dish from cache:', error);
    return null;
  }
};

/**
 * Set dish data in cache
 * @param {string} dishId - Dish ID
 * @param {Object} dishData - Dish data to cache
 * @returns {Promise<void>}
 */
export const setDishInCache = async (dishId, dishData) => {
  try {
    const cacheKey = `dish:${dishId}`;
    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(dishData));
  } catch (error) {
    console.error('Error setting dish in cache:', error);
  }
};

/**
 * Invalidate dish cache
 * @param {string} dishId - Dish ID
 * @returns {Promise<void>}
 */
export const invalidateDishCache = async (dishId) => {
  try {
    const cacheKey = `dish:${dishId}`;
    await redis.del(cacheKey);
  } catch (error) {
    console.error('Error invalidating dish cache:', error);
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
