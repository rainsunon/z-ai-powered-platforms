import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import jwt from 'jsonwebtoken';
import redis from 'redis';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import { createRateLimiter } from './middleware/rateLimiter.js';
import { setupTracing } from './utils/tracing.js';
import { setupMetrics } from './utils/metrics.js';

// Initialize Express app
const app = express();

// Initialize Redis client for token blacklist and caching
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
setupTracing('api-gateway');

// Setup Prometheus metrics
const { register, httpRequestDuration, jwtValidationDuration, rateLimitHits } = setupMetrics();

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));

app.use(compression());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging with Morgan
app.use(morgan('combined'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      auth: 'http://localhost:5001',
      orders: 'http://localhost:5002',
      restaurants: 'http://localhost:5006',
      payments: 'http://localhost:5005',
      notifications: 'http://localhost:5007',
      deliveries: 'http://localhost:5004',
      admin: 'http://localhost:5008',
    },
  });
});

// Metrics endpoint for Prometheus scraping
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Service routing configuration
const services = {
  auth: {
    target: 'http://localhost:5001',
    path: '/api/auth',
    requiresAuth: false,
  },
  orders: {
    target: 'http://localhost:5002',
    path: '/api/orders',
    requiresAuth: true,
  },
  restaurants: {
    target: 'http://localhost:5006',
    path: '/api/restaurants',
    requiresAuth: true,
  },
  payments: {
    target: 'http://localhost:5005',
    path: '/api/payments',
    requiresAuth: true,
  },
  notifications: {
    target: 'http://localhost:5007',
    path: '/api/notifications',
    requiresAuth: true,
  },
  deliveries: {
    target: 'http://localhost:5004',
    path: '/api/deliveries',
    requiresAuth: true,
  },
  admin: {
    target: 'http://localhost:5008',
    path: '/api/admin',
    requiresAuth: true,
  },
};

// JWT Validation Middleware
const validateJWT = async (req, res, next) => {
  const startTime = Date.now();
  
  // Skip validation for auth service (login, register, etc.)
  if (req.path.startsWith('/api/auth')) {
    return next();
  }

  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'No token provided',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Check if token is blacklisted
    const isBlacklisted = await redisClient.get(`blacklist:${token}`);
    if (isBlacklisted) {
      return res.status(401).json({
        success: false,
        message: 'Token has been revoked',
      });
    }

    // Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'jwt-secret-key-develop-only'
    );

    // Check user status from cache
    const cachedUser = await redisClient.get(`user:${decoded.id}`);
    let user = cachedUser ? JSON.parse(cachedUser) : null;

    if (!user || user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'User account is not active',
      });
    }

    // Attach user info to request
    req.user = {
      id: decoded.id,
      role: decoded.role,
      email: user.email,
      status: user.status,
    };

    const duration = Date.now() - startTime;
    jwtValidationDuration.observe(duration);

    next();
  } catch (error) {
    console.error('JWT Validation Error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error validating token',
    });
  }
};

// Metrics middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    httpRequestDuration.observe(duration, {
      method: req.method,
      route: req.path,
      status_code: res.statusCode,
    });
  });
  
  next();
});

// Apply rate limiting to all routes
const rateLimiter = createRateLimiter(redisClient);
app.use(rateLimiter);

// Apply JWT validation to protected routes
app.use('/api', validateJWT);

// Route to services
Object.entries(services).forEach(([serviceName, config]) => {
  console.log(`Setting up proxy for ${serviceName} -> ${config.target}${config.path}`);
  
  app.use(config.path, createProxyMiddleware({
    target: config.target,
    changeOrigin: true,
    pathRewrite: {
      [`^${config.path}`]: '',
    },
    onProxyReq: (proxyReq, req, res) => {
      // Forward original headers
      proxyReq.setHeader('X-Forwarded-For', req.ip);
      proxyReq.setHeader('X-Real-IP', req.ip);
      proxyReq.setHeader('X-Request-ID', req.id || generateRequestId());
      
      // Add user info from JWT validation
      if (req.user) {
        proxyReq.setHeader('X-User-Id', req.user.id);
        proxyReq.setHeader('X-User-Role', req.user.role);
      }
    },
    onProxyRes: (proxyRes, req, res) => {
      // Log response status
      console.log(`[${serviceName}] ${req.method} ${req.path} -> ${proxyRes.statusCode}`);
    },
    onError: (err, req, res) => {
      console.error(`Proxy Error for ${serviceName}:`, err);
      res.status(500).json({
        success: false,
        message: 'Service unavailable',
        service: serviceName,
      });
    },
  }));
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
  console.error('Gateway Error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Generate unique request ID
function generateRequestId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Start server
const PORT = process.env.GATEWAY_PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                                ║
║   🚀 API Gateway Server                                 ║
║                                                                ║
║   📡 Port: ${PORT}                                        ║
║   🔒 JWT Validation: Enabled                                   ║
║   ⚡ Rate Limiting: Enabled                                   ║
║   📊 Metrics: /metrics                                        ║
║   ❤️  Health: /health                                         ║
║                                                                ║
║   Services:                                                     ║
║   ${Object.entries(services).map(([name, config]) => 
     `║   • ${name.padEnd(15)} ${config.target.padEnd(25)} ${config.requiresAuth ? '🔒' : '🔓'} ║`
   ).join('\n')}
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

  await redisClient.quit();
  console.log('Redis client closed');
  
  process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

export default app;
