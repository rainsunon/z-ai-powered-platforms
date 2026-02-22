import promClient from 'prom-client';

// Create a Registry to register the metrics
const register = new promClient.Registry();

// Enable default metrics (CPU, memory, etc.)
promClient.collectDefaultMetrics({ register });

// HTTP request duration histogram
const httpRequestDuration = new promClient.Histogram({
  name: 'order_http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
});

// Cache hit counter
const cacheHits = new promClient.Counter({
  name: 'order_cache_hits_total',
  help: 'Total number of cache hits',
  labelNames: ['type'], // 'user', 'order', 'cart'
});

// Cache miss counter
const cacheMisses = new promClient.Counter({
  name: 'order_cache_misses_total',
  help: 'Total number of cache misses',
  labelNames: ['type'], // 'user', 'order', 'cart'
});

// Database query duration histogram
const dbQueryDuration = new promClient.Histogram({
  name: 'order_db_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  labelNames: ['operation', 'collection'],
  buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
});

// Order creation counter
const ordersCreated = new promClient.Counter({
  name: 'order_orders_created_total',
  help: 'Total number of orders created',
  labelNames: ['status'],
});

// Order update counter
const ordersUpdated = new promClient.Counter({
  name: 'order_orders_updated_total',
  help: 'Total number of orders updated',
  labelNames: ['from_status', 'to_status'],
});

// Active orders gauge
const activeOrders = new promClient.Gauge({
  name: 'order_active_orders',
  help: 'Number of currently active orders',
  labelNames: ['status'],
});

// Auth service request duration histogram
const authServiceRequestDuration = new promClient.Histogram({
  name: 'order_auth_service_request_duration_seconds',
  help: 'Duration of auth service requests in seconds',
  labelNames: ['endpoint', 'status'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
});

// WebSocket connections gauge
const websocketConnections = new promClient.Gauge({
  name: 'order_websocket_connections',
  help: 'Number of active WebSocket connections',
});

// Error counter
const errors = new promClient.Counter({
  name: 'order_errors_total',
  help: 'Total number of errors',
  labelNames: ['type', 'route'],
});

// Register all metrics
register.registerMetric(httpRequestDuration);
register.registerMetric(cacheHits);
register.registerMetric(cacheMisses);
register.registerMetric(dbQueryDuration);
register.registerMetric(ordersCreated);
register.registerMetric(ordersUpdated);
register.registerMetric(activeOrders);
register.registerMetric(authServiceRequestDuration);
register.registerMetric(websocketConnections);
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
 * Record order creation
 */
export const recordOrderCreated = (status) => {
  ordersCreated.labels(status).inc();
};

/**
 * Record order update
 */
export const recordOrderUpdated = (fromStatus, toStatus) => {
  ordersUpdated.labels(fromStatus, toStatus).inc();
};

/**
 * Set active orders count
 */
export const setActiveOrders = (status, count) => {
  activeOrders.labels(status).set(count);
};

/**
 * Record auth service request duration
 */
export const recordAuthServiceRequestDuration = (endpoint, status, duration) => {
  authServiceRequestDuration.labels(endpoint, status).observe(duration);
};

/**
 * Set WebSocket connections count
 */
export const setWebsocketConnections = (count) => {
  websocketConnections.set(count);
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
