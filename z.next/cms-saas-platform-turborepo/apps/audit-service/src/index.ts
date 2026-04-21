import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { getConfig } from '@cms/config';
import { initDatabase } from '@cms/database';
import { initCache } from '@cms/cache';
import { createServiceLogger } from '@cms/logger';
import { createErrorHandler } from '@cms/errors';
import { initTracing, MetricsCollector } from '@cms/observability';
import { getEventBus } from '@cms/messaging';
import { auditRoutes } from './routes';
import { recordAuditEvent } from './recorder';

async function main() {
  const config = getConfig();
  const logger = createServiceLogger('audit-service');

  initTracing({ serviceName: 'audit-service', endpoint: config.observability?.otlpEndpoint });
  const metrics = new MetricsCollector('audit_service');

  await initDatabase(config.db);
  await initCache(config.redis);

  const app = Fastify({ logger: false });
  await app.register(cors, { origin: true, credentials: true });
  await app.register(helmet);
  app.setErrorHandler(createErrorHandler(logger));
  app.addHook('onRequest', async (request) => { metrics.recordRequest(request.method, request.url); });
  app.get('/health', async () => ({ status: 'ok', service: 'audit-service' }));
  app.get('/metrics', async () => metrics.getMetrics());
  await app.register(auditRoutes, { prefix: '/audit' });

  // Subscribe to ALL events for audit logging
  const eventBus = getEventBus();
  eventBus.subscribeAll(async (event) => {
    try {
      await recordAuditEvent(event);
    } catch (err) {
      logger.error({ err, event: event.type }, 'Failed to record audit event');
    }
  });

  const port = Number(process.env.AUDIT_SERVICE_PORT) || 3013;
  await app.listen({ port, host: '0.0.0.0' });
  logger.info(`Audit service listening on port ${port}`);
}

main().catch((err) => { console.error('Failed to start audit service:', err); process.exit(1); });
