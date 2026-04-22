import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { serve } from '@hono/node-server';
import { getConfig } from '@cms/config';
import { initCache } from '@cms/cache';
import { createServiceLogger } from '@cms/logger';
import { AppError, serializeError } from '@cms/errors';
import { createRateLimiter } from '@cms/rate-limit';
import { MetricsCollector } from '@cms/observability';

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

const SERVICE_ROUTE_MAP: Record<string, string> = {
  auth: 'auth', users: 'users', tenants: 'tenants', content: 'content',
  media: 'media', comments: 'comments', analytics: 'analytics', notifications: 'notifications',
  search: 'search', workflows: 'workflows', plugins: 'plugins', features: 'features',
  audit: 'audit', settings: 'settings', ai: 'ai',
};

function createReply() {
  const state = {
    statusCode: 200,
    headers: {} as Record<string, string>,
    sentBody: undefined as unknown,
    sent: false,
    status(code: number) {
      state.statusCode = code;
      return state;
    },
    send(payload?: unknown) {
      state.sentBody = payload;
      state.sent = true;
      return state;
    },
    header(name: string, value: string | number) {
      state.headers[name] = String(value);
      return state;
    },
  };

  return state;
}

async function main() {
  const config = getConfig();
  const logger = createServiceLogger('api-gateway');
  const metrics = new MetricsCollector('api_gateway');

  await initCache(config.redis);

  const app = new Hono();

  app.use('*', cors({
    origin: config.cors?.origins || true,
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-Tenant-ID', 'X-API-Key', 'X-Request-ID'],
    exposeHeaders: ['X-Request-ID', 'X-RateLimit-Limit', 'X-RateLimit-Remaining'],
  }));

  app.use('*', secureHeaders({ contentSecurityPolicy: false }));

  const rateLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    maxRequests: 100,
    keyGenerator: (request) => request.headers['x-api-key'] || request.ip || 'unknown',
  });

  app.use('/api/v1/*', async (c, next) => {
    const requestId = c.req.header('x-request-id')
      || `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const request = {
      method: c.req.method,
      url: c.req.url,
      headers: Object.fromEntries(c.req.raw.headers.entries()) as Record<string, string>,
      query: c.req.query(),
      params: c.req.param(),
      body: {},
      id: requestId,
      ip: c.req.header('x-forwarded-for')?.split(',')[0]?.trim() || c.req.header('x-real-ip') || 'unknown',
      file: async () => null,
    };

    const reply = createReply();
    await rateLimiter(request, reply);

    c.header('X-Request-ID', requestId);
    for (const [key, value] of Object.entries(reply.headers)) {
      c.header(key, value);
    }

    metrics.recordRequest(c.req.method, c.req.path);
    await next();
  });

  app.onError((err, c) => {
    if (err instanceof AppError) {
      return c.json(serializeError(err), err.statusCode as 400 | 401 | 403 | 404 | 409 | 429 | 500 | 503);
    }

    logger.error({ err }, 'Unhandled gateway error');
    return c.json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error', statusCode: 500 } }, 500);
  });

  app.get('/health', async (c) => {
    const checks: Record<string, string> = {};
    for (const [name, svc] of Object.entries(SERVICES)) {
      try {
        const response = await fetch(`${svc.upstream}/health`, { signal: AbortSignal.timeout(2000) });
        checks[name] = response.ok ? 'healthy' : 'unhealthy';
      } catch {
        checks[name] = 'unreachable';
      }
    }

    return c.json({ status: 'ok', service: 'api-gateway', services: checks });
  });

  app.get('/metrics', async (c) => {
    return c.text(metrics.getMetrics());
  });

  for (const [name, svc] of Object.entries(SERVICES)) {
    const forward = async (c: any) => {
      const requestId = c.req.header('x-request-id')
        || `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const incoming = new URL(c.req.url);
      const suffix = incoming.pathname.slice(svc.prefix.length);
      const rewritePath = `/${SERVICE_ROUTE_MAP[name]}${suffix}`;

      const target = new URL(svc.upstream);
      target.pathname = rewritePath;
      target.search = incoming.search;

      const upstreamHeaders = new Headers(c.req.raw.headers);
      upstreamHeaders.set('x-request-id', requestId);

      const init: RequestInit = {
        method: c.req.method,
        headers: upstreamHeaders,
      };

      if (!['GET', 'HEAD'].includes(c.req.method)) {
        init.body = await c.req.arrayBuffer();
      }

      const upstream = await fetch(target.toString(), init);
      const responseHeaders = new Headers(upstream.headers);
      responseHeaders.set('x-request-id', requestId);

      metrics.incrementCounter('http_responses', { method: c.req.method, status: String(upstream.status) });
      return new Response(upstream.body, { status: upstream.status, headers: responseHeaders });
    };

    app.all(`${svc.prefix}`, forward);
    app.all(`${svc.prefix}/*`, forward);

    logger.info({ service: name, prefix: svc.prefix, upstream: svc.upstream }, 'Registered proxy route');
  }

  const port = Number(process.env.API_GATEWAY_PORT) || 3000;
  serve({ fetch: app.fetch, port, hostname: '0.0.0.0' });
  logger.info({ port }, 'API Gateway listening');
}

main().catch((err) => {
  console.error('Failed to start API gateway:', err);
  process.exit(1);
});
