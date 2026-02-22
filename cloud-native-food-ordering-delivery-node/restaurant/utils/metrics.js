import promClient from 'prom-client';

// Create a Registry to register the metrics
const register = new promClient.Registry();

// Enable default metrics (CPU, memory, etc.)
promClient.collectDefaultMetrics({ register });

// HTTP request duration histogram
const httpRequestDuration = new promClient.Histogram({
  name: 'restaurant_http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
});

// Cache hit counter
const cacheHits = new promClient.Counter({
  name: 'restaurant_cache_hits_total',
  help: 'Total number of cache hits',
  labelNames: ['type'], // 'user', 'restaurant', 'dish'
});

// Cache miss counter
const cacheMisses = new promClient.Counter({
  name: 'restaurant_cache_misses_total',
  help: 'Total number of cache misses',
  labelNames: ['type'], // 'user', 'restaurant', 'dish'
});

// Database query duration histogram
const dbQueryDuration = new promClient.Histogram({
  name: 'restaurant_db_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  labelNames: ['operation', 'collection'],
  buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
});

// Restaurant creation counter
const restaurantsCreated = new promClient.Counter({
  name: 'restaurant_restaurants_created_total',
  help: 'Total number of restaurants created',
  labelNames: ['status'],
});

// Restaurant update counter
const restaurantsUpdated = new promClient.Counter({
  name: 'restaurant_restaurants_updated_total',
  help: 'Total number of restaurants updated',
  labelNames: ['field'],
});

// Dish creation counter
const dishesCreated = new promClient.Counter({
  name: 'restaurant_dishes_created_total',
  help: 'Total number of dishes created',
  labelNames: ['status'],
});

// Dish update counter
const dishesUpdated = new promClient.Counter({
  name: 'restaurant_dishes_updated_total',
  help: 'Total number of dishes updated',
  labelNames: ['field'],
});

// Auth service request duration histogram
const authServiceRequestDuration = new promClient.Histogram({
  name: 'restaurant_auth_service_request_duration_seconds',
  help: 'Duration of auth service requests in seconds',
  labelNames: ['endpoint', 'status'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
});

// Error counter
const errors = new promClient.Counter({
  name: 'restaurant_errors_total',
  help: 'Total number of errors',
  labelNames: ['type', 'route'],
});

// Register all metrics
register.registerMetric(httpRequestDuration);
register.registerMetric(cacheHits);
register.registerMetric(cacheMisses);
register.registerMetric(dbQueryDuration);
register.registerMetric(restaurantsCreated);
register.registerMetric(restaurantsUpdated);
register.registerMetric(dishesCreated);
register.registerMetric(dishesUpdated);
register.registerMetric(authServiceRequestDuration);
register.registerMetric(errors);

/**
 * Middleware to track HTTP request duration
 */
export const trackHttpRequestDuration = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000; // Convert to seconds
    httpRequestDuration
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .observe(duration);
  });
  
  next();
};

/**
 * Record cache hit
 */
export const recordCacheHit = (type) => {
  cacheHits.labels(type).inc();
};

/**
 * Record cache miss
 */
export const recordCacheMiss = (type) => {
  cacheMisses.labels(type).inc();
};

/**
 * Record database query duration
 */
export const recordDbQueryDuration = (operation, collection, duration) => {
  dbQueryDuration.labels(operation, collection).observe(duration);
};

/**
 * Record restaurant creation
 */
export const recordRestaurantCreated = (status) => {
  restaurantsCreated.labels(status).inc();
};

/**
 * Record restaurant update
 */
export const recordRestaurantUpdated = (field) => {
  restaurantsUpdated.labels(field).inc();
};

/**
 * Record dish creation
 */
export const recordDishCreated = (status) => {
  dishesCreated.labels(status).inc();
};

/**
 * Record dish update
 */
export const recordDishUpdated = (field) => {
  dishesUpdated.labels(field).inc();
};

/**
 * Record auth service request duration
 */
export const recordAuthServiceRequestDuration = (endpoint, status, duration) => {
  authServiceRequestDuration.labels(endpoint, status).observe(duration);
};

/**
 * Record error
 */
export const recordError = (type, route) => {
  errors.labels(type, route).inc();
};

/**
 * Get metrics in Prometheus format
 */
export const getMetrics = async () => {
  return await register.metrics();
};

/**
 * Get content type for metrics endpoint
 */
export const getMetricsContentType = () => {
  return register.contentType;
};

export default register;
