import promClient from 'prom-client';

// Create a Registry to register the metrics
const register = new promClient.Registry();

// Enable default metrics (CPU, memory, etc.)
promClient.collectDefaultMetrics({ register });

// HTTP request duration histogram
const httpRequestDuration = new promClient.Histogram({
  name: 'admin_http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
});

// Cache hit counter
const cacheHits = new promClient.Counter({
  name: 'admin_cache_hits_total',
  help: 'Total number of cache hits',
  labelNames: ['type'], // 'user', 'settlement'
});

// Cache miss counter
const cacheMisses = new promClient.Counter({
  name: 'admin_cache_misses_total',
  help: 'Total number of cache misses',
  labelNames: ['type'], // 'user', 'settlement'
});

// Database query duration histogram
const dbQueryDuration = new promClient.Histogram({
  name: 'admin_db_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  labelNames: ['operation', 'collection'],
  buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
});

// Settlement processed counter
const settlementsProcessed = new promClient.Counter({
  name: 'admin_settlements_processed_total',
  help: 'Total number of settlements processed',
  labelNames: ['status'],
});

// Auth service request duration histogram
const authServiceRequestDuration = new promClient.Histogram({
  name: 'admin_auth_service_request_duration_seconds',
  help: 'Duration of auth service requests in seconds',
  labelNames: ['endpoint', 'status'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
});

// Error counter
const errors = new promClient.Counter({
  name: 'admin_errors_total',
  help: 'Total number of errors',
  labelNames: ['type', 'route'],
});

// Register all metrics
register.registerMetric(httpRequestDuration);
register.registerMetric(cacheHits);
register.registerMetric(cacheMisses);
register.registerMetric(dbQueryDuration);
register.registerMetric(settlementsProcessed);
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
 * Record settlement processed
 */
export const recordSettlementProcessed = (status) => {
  settlementsProcessed.labels(status).inc();
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
