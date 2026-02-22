import { register, Counter, Histogram, Gauge } from 'prom-client';

/**
 * Setup Prometheus metrics for Rate Limiter Service
 * @returns {Object} Metrics collection
 */
export const setupMetrics = () => {
  // Rate Limit Checks Counter
  const rateLimitChecks = new Counter({
    name: 'rate_limit_checks_total',
    help: 'Total number of rate limit checks',
    labelNames: ['route', 'identifier'],
    registers: [register],
  });

  // Rate Limit Allowed Counter
  const rateLimitAllowed = new Counter({
    name: 'rate_limit_allowed_total',
    help: 'Total number of requests allowed by rate limit',
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

  // Active Rules Gauge
  const activeRules = new Gauge({
    name: 'active_rate_limit_rules',
    help: 'Number of active rate limit rules',
    registers: [register],
  });

  // Check Duration Histogram
  const checkDuration = new Histogram({
    name: 'rate_limit_check_duration_seconds',
    help: 'Duration of rate limit checks in seconds',
    labelNames: ['route'],
    buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1],
    registers: [register],
  });

  // Database Connection Pool Gauge
  const dbPoolConnections = new Gauge({
    name: 'database_pool_connections',
    help: 'Number of database pool connections',
    registers: [register],
  });

  // Redis Operations Counter
  const redisOperations = new Counter({
    name: 'redis_operations_total',
    help: 'Total number of Redis operations',
    labelNames: ['operation'],
    registers: [register],
  });

  console.log('✅ Prometheus metrics configured for Rate Limiter Service');
  console.log('   Available metrics:');
  console.log('   - rate_limit_checks_total');
  console.log('   - rate_limit_allowed_total');
  console.log('   - rate_limit_blocked_total');
  console.log('   - active_rate_limit_rules');
  console.log('   - rate_limit_check_duration_seconds');
  console.log('   - database_pool_connections');
  console.log('   - redis_operations_total');

  return {
    register,
    rateLimitChecks,
    rateLimitAllowed,
    rateLimitBlocked,
    activeRules,
    checkDuration,
    dbPoolConnections,
    redisOperations,
  };
};

export default {
  setupMetrics,
};
