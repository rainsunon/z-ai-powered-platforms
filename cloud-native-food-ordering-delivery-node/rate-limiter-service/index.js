import express from 'express';
import pg from 'pg';
import redis from 'redis';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { setupTracing } from './utils/tracing.js';
import { setupMetrics } from './utils/metrics.js';
import { RateLimiterManager } from './services/rateLimiterManager.js';

// Initialize Express app
const app = express();

// Initialize PostgreSQL connection for rate limit rules
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/rate_limiter',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Initialize Redis client for token buckets
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    reconnectStrategy: 'reconnect',
    reconnectDelay: 100,
  },
});

redisClient.on('error', (err) => console.error('Redis Client Error:', err));
redisClient.on('connect', () => console.log('Redis Client Connected'));

// Setup OpenTelemetry tracing
setupTracing('rate-limiter-service');

// Setup Prometheus metrics
const { register, rateLimitChecks, rateLimitAllowed, rateLimitBlocked, activeRules } = setupMetrics();

// Initialize rate limiter manager
const rateLimiterManager = new RateLimiterManager(pool, redisClient);

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
    },
  },
}));

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging with Morgan
app.use(morgan('combined'));

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Check PostgreSQL connection
    const pgResult = await pool.query('SELECT NOW()');
    
    // Check Redis connection
    const redisPing = await redisClient.ping();
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: {
        postgresql: 'connected',
        redis: redisPing === 'PONG' ? 'connected' : 'disconnected',
      },
      rate_limiter: {
        active_rules: await rateLimiterManager.getActiveRulesCount(),
        total_requests: await rateLimiterManager.getTotalRequestsCount(),
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
    });
  }
});

// Metrics endpoint for Prometheus scraping
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

/**
 * Check if request should be rate limited
 * POST /api/check
 */
app.post('/api/check', async (req, res) => {
  const { identifier, route } = req.body;

  if (!identifier || !route) {
    return res.status(400).json({
      success: false,
      message: 'Identifier and route are required',
    });
  }

  try {
    const result = await rateLimiterManager.checkRateLimit(identifier, route);
    
    if (result.allowed) {
      rateLimitAllowed.inc({ route, identifier });
      res.json({
        success: true,
        allowed: true,
        remaining: result.remaining,
        reset: result.reset,
      });
    } else {
      rateLimitBlocked.inc({ route, identifier });
      res.status(429).json({
        success: false,
        allowed: false,
        message: 'Rate limit exceeded',
        retryAfter: result.retryAfter,
      });
    }
  } catch (error) {
    console.error('Rate limit check error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking rate limit',
    });
  }
});

/**
 * Get rate limit status for an identifier
 * GET /api/status/:identifier
 */
app.get('/api/status/:identifier', async (req, res) => {
  const { identifier } = req.params;

  try {
    const status = await rateLimiterManager.getStatus(identifier);
    res.json({
      success: true,
      status,
    });
  } catch (error) {
    console.error('Get status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting status',
    });
  }
});

/**
 * Reset rate limit for an identifier (admin only)
 * POST /api/reset
 */
app.post('/api/reset', async (req, res) => {
  const { identifier, route, adminKey } = req.body;

  // Simple admin key validation
  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized',
    });
  }

  if (!identifier || !route) {
    return res.status(400).json({
      success: false,
      message: 'Identifier and route are required',
    });
  }

  try {
    await rateLimiterManager.resetRateLimit(identifier, route);
    res.json({
      success: true,
      message: 'Rate limit reset successfully',
    });
  } catch (error) {
    console.error('Reset error:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting rate limit',
    });
  }
});

/**
 * Get all rate limit rules
 * GET /api/rules
 */
app.get('/api/rules', async (req, res) => {
  try {
    const rules = await rateLimiterManager.getAllRules();
    activeRules.set(rules.length);
    res.json({
      success: true,
      rules,
    });
  } catch (error) {
    console.error('Get rules error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting rules',
    });
  }
});

/**
 * Add or update rate limit rule
 * POST /api/rules
 */
app.post('/api/rules', async (req, res) => {
  const { route, windowMs, maxRequests, adminKey } = req.body;

  // Simple admin key validation
  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized',
    });
  }

  if (!route || !windowMs || !maxRequests) {
    return res.status(400).json({
      success: false,
      message: 'Route, windowMs, and maxRequests are required',
    });
  }

  try {
    await rateLimiterManager.upsertRule(route, windowMs, maxRequests);
    res.json({
      success: true,
      message: 'Rule created/updated successfully',
    });
  } catch (error) {
    console.error('Upsert rule error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating/updating rule',
    });
  }
});

/**
 * Delete rate limit rule
 * DELETE /api/rules/:route
 */
app.delete('/api/rules/:route', async (req, res) => {
  const { route } = req.params;
  const { adminKey } = req.query;

  // Simple admin key validation
  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized',
    });
  }

  try {
    await rateLimiterManager.deleteRule(route);
    res.json({
      success: true,
      message: 'Rule deleted successfully',
    });
  } catch (error) {
    console.error('Delete rule error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting rule',
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Rate Limiter Service Error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Initialize database tables and default rules
const initializeService = async () => {
  try {
    console.log('Initializing Rate Limiter Service...');
    
    // Create rate_limit_rules table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS rate_limit_rules (
        id SERIAL PRIMARY KEY,
        route VARCHAR(255) UNIQUE NOT NULL,
        window_ms INTEGER NOT NULL,
        max_requests INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create request_logs table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS request_logs (
        id SERIAL PRIMARY KEY,
        identifier VARCHAR(255) NOT NULL,
        route VARCHAR(255) NOT NULL,
        allowed BOOLEAN NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert default rate limit rules
    const defaultRules = [
      { route: '/api/auth/login', windowMs: 15 * 60 * 1000, maxRequests: 5 },
      { route: '/api/auth/register', windowMs: 60 * 60 * 1000, maxRequests: 3 },
      { route: '/api/auth/send-otp', windowMs: 60 * 1000, maxRequests: 3 },
      { route: '/api/auth/verify-otp', windowMs: 5 * 60 * 1000, maxRequests: 10 },
      { route: '/api/orders', windowMs: 60 * 1000, maxRequests: 100 },
      { route: '/api/restaurants', windowMs: 60 * 1000, maxRequests: 100 },
      { route: '/api/payments', windowMs: 60 * 1000, maxRequests: 50 },
      { route: '/api/notifications', windowMs: 60 * 1000, maxRequests: 100 },
      { route: '/api/deliveries', windowMs: 60 * 1000, maxRequests: 100 },
      { route: '/api/admin', windowMs: 60 * 1000, maxRequests: 100 },
    ];

    for (const rule of defaultRules) {
      await pool.query(`
        INSERT INTO rate_limit_rules (route, window_ms, max_requests)
        VALUES ($1, $2, $3)
        ON CONFLICT (route) DO UPDATE SET
          window_ms = EXCLUDED.window_ms,
          max_requests = EXCLUDED.max_requests,
          updated_at = CURRENT_TIMESTAMP
      `, [rule.route, rule.windowMs, rule.maxRequests]);
    }

    console.log('✅ Rate Limiter Service initialized successfully');
    console.log(`   ${defaultRules.length} default rules loaded`);
  } catch (error) {
    console.error('Failed to initialize Rate Limiter Service:', error);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, async () => {
  await initializeService();
  
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                                ║
║   ⚡ Rate Limiter Service                                ║
║                                                                ║
║   📡 Port: ${PORT}                                        ║
║   💾 PostgreSQL: Connected                                    ║
║   🔴 Redis: Connected                                       ║
║   📊 Metrics: /metrics                                        ║
║   ❤️  Health: /health                                         ║
║                                                                ║
║   Endpoints:                                                     ║
║   • POST   /api/check          - Check rate limit              ║
║   • GET    /api/status/:id      - Get status                 ║
║   • POST   /api/reset          - Reset rate limit (admin)    ║
║   • GET    /api/rules          - Get all rules              ║
║   • POST   /api/rules          - Add/update rule (admin)    ║
║   • DELETE /api/rules/:route    - Delete rule (admin)        ║
║                                                                ║
╚══════════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
const shutdown = async (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  
  server.close(() => {
    console.log('HTTP server closed');
  });

  await pool.end();
  console.log('PostgreSQL pool closed');

  await redisClient.quit();
  console.log('Redis client closed');
  
  process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

export default app;
