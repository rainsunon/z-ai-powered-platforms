import { register, Counter, Histogram, Gauge, Summary } from 'prom-client';

/**
 * Setup Prometheus metrics for API Gateway
 * @returns {Object} Metrics collection
 */
export const setupMetrics = () => {
  // HTTP Request Duration Histogram
  const httpRequestDuration = new Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code', 'service'],
    buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
    registers: [register],
  });

  // JWT Validation Duration Histogram
  const jwtValidationDuration = new Histogram({
    name: 'jwt_validation_duration_seconds',
    help: 'Duration of JWT validation in seconds',
    labelNames: ['status'],
    buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1],
    registers: [register],
  });

  // Rate Limit Hits Counter
  const rateLimitHits = new Counter({
    name: 'rate_limit_hits_total',
    help: 'Total number of rate limit hits',
    labelNames: ['route', 'identifier'],
    registers: [register],
  });

  // Rate Limit Blocked Counter
  const rateLimitBlocked = new Counter({
    name: 'rate_limit_blocked_total',
    help: 'Total number of requests blocked by rate limit',
    labelNames: ['route', 'identifier'],
    registers: [register],
  });

  // HTTP Requests Total Counter
  const httpRequestsTotal = new Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code', 'service'],
    registers: [register],
  });

  // Active Connections Gauge
  const activeConnections = new Gauge({
    name: 'active_connections',
    help: 'Number of active connections',
    registers: [register],
  });

  // Service Response Time Summary
  const serviceResponseTime = new Summary({
    name: 'service_response_time_seconds',
    help: 'Response time of downstream services in seconds',
    labelNames: ['service', 'route'],
    percentiles: [0.5, 0.9, 0.95, 0.99],
    registers: [register],
  });

  // Cache Hit Rate Gauge
  const cacheHitRate = new Gauge({
    name: 'cache_hit_rate',
    help: 'Cache hit rate percentage',
    labelNames: ['cache_type'],
    registers: [register],
  });

  // Token Blacklist Size Gauge
  const tokenBlacklistSize = new Gauge({
    name: 'token_blacklist_size',
    help: 'Number of tokens in blacklist',
    registers: [register],
  });

  // Error Rate Counter
  const errorRate = new Counter({
    name: 'error_rate_total',
    help: 'Total number of errors',
    labelNames: ['type', 'service', 'route'],
    registers: [register],
  });

  // Throughput Counter
  const throughput = new Counter({
    name: 'throughput_total',
    help: 'Total number of requests processed',
    labelNames: ['service'],
    registers: [register],
  });

  console.log('✅ Prometheus metrics configured');
  console.log('   Available metrics:');
  console.log('   - http_request_duration_seconds');
  console.log('   - jwt_validation_duration_seconds');
  console.log('   - rate_limit_hits_total');
  console.log('   - rate_limit_blocked_total');
  console.log('   - http_requests_total');
  console.log('   - active_connections');
  console.log('   - service_response_time_seconds');
  console.log('   - cache_hit_rate');
  console.log('   - token_blacklist_size');
  console.log('   - error_rate_total');
  console.log('   - throughput_total');

  return {
    register,
    httpRequestDuration,
    jwtValidationDuration,
    rateLimitHits,
    rateLimitBlocked,
    httpRequestsTotal,
    activeConnections,
    serviceResponseTime,
    cacheHitRate,
    tokenBlacklistSize,
    errorRate,
    throughput,
  };
};

/**
 * Increment HTTP request counter
 * @param {Object} labels - Labels for the counter
 */
export const incrementHttpRequests = (labels) => {
  const { httpRequestsTotal } = setupMetrics();
  httpRequestsTotal.inc(labels);
};

/**
 * Observe HTTP request duration
 * @param {number} duration - Duration in seconds
 * @param {Object} labels - Labels for the histogram
 */
export const observeRequestDuration = (duration, labels) => {
  const { httpRequestDuration } = setupMetrics();
  httpRequestDuration.observe(duration, labels);
};

/**
 * Increment error counter
 * @param {Object} labels - Labels for the counter
 */
export const incrementErrors = (labels) => {
  const { errorRate } = setupMetrics();
  errorRate.inc(labels);
};

/**
 * Set active connections gauge
 * @param {number} value - Number of active connections
 */
export const setActiveConnections = (value) => {
  const { activeConnections } = setupMetrics();
  activeConnections.set(value);
};

/**
 * Observe service response time
 * @param {number} duration - Duration in seconds
 * @param {Object} labels - Labels for the summary
 */
export const observeServiceResponseTime = (duration, labels) => {
  const { serviceResponseTime } = setupMetrics();
  serviceResponseTime.observe(duration, labels);
};

/**
 * Set cache hit rate
 * @param {number} value - Hit rate percentage (0-100)
 * @param {string} cacheType - Type of cache
 */
export const setCacheHitRate = (value, cacheType) => {
  const { cacheHitRate } = setupMetrics();
  cacheHitRate.set(value, { cache_type: cacheType });
};

/**
 * Increment throughput counter
 * @param {string} service - Service name
 */
export const incrementThroughput = (service) => {
  const { throughput } = setupMetrics();
  throughput.inc({ service });
};

export default {
  setupMetrics,
  incrementHttpRequests,
  observeRequestDuration,
  incrementErrors,
  setActiveConnections,
  observeServiceResponseTime,
  setCacheHitRate,
  incrementThroughput,
};
