import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { getConfig } from '@cms/config';
import { createServiceLogger } from '@cms/logger';
import { createDatabase } from '@cms/database';
import { AppError, serializeError } from '@cms/errors';
import { getMetrics, getHealthChecker, createRequestTimer } from '@cms/observability';
import { authRoutes } from './routes';

const logger = createServiceLogger('auth-service');
const metrics = getMetrics('auth');
const healthChecker = getHealthChecker();

export async function buildServer() {
  const config = getConfig();

  const app = Fastify({
    logger: false,
    trustProxy: true,
    requestIdHeader: 'x-request-id',
  });

  // ─── Plugins ───────────────────────────────
  await app.register(cors, {
    origin: config.isDevelopment ? true : false,
    credentials: true,
  });

  await app.register(helmet, {
    contentSecurityPolicy: config.isProduction,
  });

  // ─── Database ───────────────────────────────
  const db = createDatabase(config.database);
  healthChecker.register({ name: 'postgres', check: async () => { await db.raw('SELECT 1'); return true; } });

  // ─── Request Logging & Metrics ───────────────
  app.addHook('onRequest', async (request) => {
    (request as any).timer = createRequestTimer();
    logger.info({ method: request.method, url: request.url, requestId: request.id }, 'Incoming request');
  });

  app.addHook('onResponse', async (request, reply) => {
    const duration = (request as any).timer?.end() ?? 0;
    metrics.incrementCounter('http_requests', { method: request.method, status: String(reply.statusCode) });
    metrics.recordHistogram('http_request_duration_ms', duration, { method: request.method });
    logger.info({ method: request.method, url: request.url, statusCode: reply.statusCode, duration }, 'Request completed');
  });

  // ─── Error Handler ───────────────────────────
  app.setErrorHandler(async (error, _request, reply) => {
    if (error instanceof AppError) {
      logger.warn({ err: error, code: error.code }, error.message);
      return reply.status(error.statusCode).send(serializeError(error, config.isDevelopment));
    }

    logger.error({ err: error }, 'Unhandled error');
    return reply.status(500).send({
      error: { code: 'INTERNAL_ERROR', message: 'Internal server error', statusCode: 500 },
    });
  });

  // ─── Health Endpoint ───────────────────────────
  app.get('/health', async () => {
    return healthChecker.check();
  });

  app.get('/metrics', async () => {
    return metrics.toPrometheus();
  });

  // ─── Routes ───────────────────────────────
  await app.register(authRoutes, { prefix: '/auth' });

  return app;
}

async function start() {
  try {
    const config = getConfig();
    const app = await buildServer();
    const port = Number(process.env.AUTH_SERVICE_PORT) || 3001;

    await app.listen({ port, host: '0.0.0.0' });
    logger.info({ port }, 'Auth service started');
  } catch (err) {
    logger.fatal({ err }, 'Failed to start auth service');
    process.exit(1);
  }
}

start();
