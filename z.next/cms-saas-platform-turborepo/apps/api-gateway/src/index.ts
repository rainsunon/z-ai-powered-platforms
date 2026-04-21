import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import proxy from '@fastify/http-proxy';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { getConfig } from '@cms/config';
import { initCache } from '@cms/cache';
import { createServiceLogger } from '@cms/logger';
import { createErrorHandler } from '@cms/errors';
import { createRateLimiter } from '@cms/rate-limit';
import { initTracing, MetricsCollector } from '@cms/observability';

// Service registry
const SERVICES = {
  auth: { upstream: process.env.AUTH_SERVICE_URL || 'http://localhost:3001', prefix: '/api/v1/auth' },
  users: { upstream: process.env.USER_SERVICE_URL || 'http://localhost:3002', prefix: '/api/v1/users' },
  tenants: { upstream: process.env.TENANT_SERVICE_URL || 'http://localhost:3003', prefix: '/api/v1/tenants' },
  content: { upstream: process.env.CONTENT_SERVICE_URL || 'http://localhost:3004', prefix: '/api/v1/content' },
  media: { upstream: process.env.MEDIA_SERVICE_URL || 'http://localhost:3005', prefix: '/api/v1/media' },
  comments: { upstream: process.env.COMMENT_SERVICE_URL || 'http://localhost:3006', prefix: '/api/v1/comments' },
  analytics: { upstream: process.env.ANALYTICS_SERVICE_URL || 'http://localhost:3007', prefix: '/api/v1/analytics' },
  notifications: { upstream: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3008', prefix: '/api/v1/notifications' },
  search: { upstream: process.env.SEARCH_SERVICE_URL || 'http://localhost:3009', prefix: '/api/v1/search' },
  workflows: { upstream: process.env.WORKFLOW_SERVICE_URL || 'http://localhost:3010', prefix: '/api/v1/workflows' },
  plugins: { upstream: process.env.PLUGIN_SERVICE_URL || 'http://localhost:3011', prefix: '/api/v1/plugins' },
  features: { upstream: process.env.FEATURE_SERVICE_URL || 'http://localhost:3012', prefix: '/api/v1/features' },
  audit: { upstream: process.env.AUDIT_SERVICE_URL || 'http://localhost:3013', prefix: '/api/v1/audit' },
  settings: { upstream: process.env.SETTINGS_SERVICE_URL || 'http://localhost:3014', prefix: '/api/v1/settings' },
  ai: { upstream: process.env.AI_SERVICE_URL || 'http://localhost:3015', prefix: '/api/v1/ai' },
};

async function main() {
  const config = getConfig();
  const logger = createServiceLogger('api-gateway');

  initTracing({ serviceName: 'api-gateway', endpoint: config.observability?.otlpEndpoint });
  const metrics = new MetricsCollector('api_gateway');

  await initCache(config.redis);

  const app = Fastify({
    logger: false,
    trustProxy: true,
    bodyLimit: 100 * 1024 * 1024, // 100MB for media uploads
  });

  // Global middleware
  await app.register(cors, {
    origin: config.cors?.origins || true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Tenant-ID', 'X-API-Key', 'X-Request-ID'],
    exposedHeaders: ['X-Request-ID', 'X-RateLimit-Limit', 'X-RateLimit-Remaining'],
  });

  await app.register(helmet, {
    contentSecurityPolicy: false, // Handled by frontend
  });

  app.setErrorHandler(createErrorHandler(logger));

  // Global rate limiting
  const rateLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    maxRequests: 100,
    keyGenerator: (request) => {
      return request.headers['x-api-key'] as string
        || request.ip
        || 'unknown';
    },
  });
  app.addHook('preHandler', rateLimiter);

  // Request ID injection
  app.addHook('onRequest', async (request, reply) => {
    const requestId = (request.headers['x-request-id'] as string)
      || `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    reply.header('X-Request-ID', requestId);
    metrics.recordRequest(request.method, request.url);
  });

  // Swagger documentation
  await app.register(swagger, {
    openapi: {
      info: {
        title: 'CMS SaaS API',
        description: 'Production-grade Content Management System API',
        version: '1.0.0',
      },
      servers: [
        { url: 'http://localhost:3000', description: 'Development' },
        { url: 'https://api.cms.example.com', description: 'Production' },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
          apiKey: {
            type: 'apiKey',
            in: 'header',
            name: 'X-API-Key',
          },
        },
      },
      security: [{ bearerAuth: [] }],
    },
  });

  await app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
    },
  });

  // Health check
  app.get('/health', async () => {
    const checks: Record<string, string> = {};
    for (const [name, svc] of Object.entries(SERVICES)) {
      try {
        const response = await fetch(`${svc.upstream}/health`, { signal: AbortSignal.timeout(2000) });
        checks[name] = response.ok ? 'healthy' : 'unhealthy';
      } catch {
        checks[name] = 'unreachable';
      }
    }
    return { status: 'ok', service: 'api-gateway', services: checks };
  });

  // Metrics endpoint
  app.get('/metrics', async () => metrics.getMetrics());

  // Register proxy routes for each service
  for (const [name, svc] of Object.entries(SERVICES)) {
    await app.register(proxy, {
      upstream: svc.upstream,
      prefix: svc.prefix,
      rewritePrefix: `/${name === 'auth' ? 'auth' : name === 'users' ? 'users' : name === 'tenants' ? 'tenants' : name === 'content' ? 'content' : name === 'media' ? 'media' : name === 'comments' ? 'comments' : name === 'analytics' ? 'analytics' : name === 'notifications' ? 'notifications' : name === 'search' ? 'search' : name === 'workflows' ? 'workflows' : name === 'plugins' ? 'plugins' : name === 'features' ? 'features' : name === 'audit' ? 'audit' : name === 'settings' ? 'settings' : 'ai'}`,
      http2: false,
      httpMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      proxyPayloads: true,
      preHandler: async (request) => {
        // Forward request ID
        request.headers['x-request-id'] = request.headers['x-request-id']
          || `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      },
    });

    logger.info({ service: name, prefix: svc.prefix, upstream: svc.upstream }, 'Registered proxy route');
  }

  const port = Number(process.env.API_GATEWAY_PORT) || 3000;
  await app.listen({ port, host: '0.0.0.0' });
  logger.info(`API Gateway listening on port ${port}`);
  logger.info(`API Documentation: http://localhost:${port}/docs`);
}

main().catch((err) => {
  console.error('Failed to start API gateway:', err);
  process.exit(1);
});
