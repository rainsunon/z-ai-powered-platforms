import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { getConfig } from '@cms/config';
import { initDatabase } from '@cms/database';
import { initCache } from '@cms/cache';
import { createServiceLogger } from '@cms/logger';
import { createErrorHandler } from '@cms/errors';
import { initTracing, MetricsCollector } from '@cms/observability';
import { settingsRoutes } from './routes';

async function main() {
  const config = getConfig();
  const logger = createServiceLogger('settings-service');

  initTracing({ serviceName: 'settings-service', endpoint: config.observability?.otlpEndpoint });
  const metrics = new MetricsCollector('settings_service');

  await initDatabase(config.db);
  await initCache(config.redis);

  const app = Fastify({ logger: false });
  await app.register(cors, { origin: true, credentials: true });
  await app.register(helmet);
  app.setErrorHandler(createErrorHandler(logger));
  app.addHook('onRequest', async (request) => { metrics.recordRequest(request.method, request.url); });
  app.get('/health', async () => ({ status: 'ok', service: 'settings-service' }));
  app.get('/metrics', async () => metrics.getMetrics());
  await app.register(settingsRoutes, { prefix: '/settings' });

  const port = Number(process.env.SETTINGS_SERVICE_PORT) || 3014;
  await app.listen({ port, host: '0.0.0.0' });
  logger.info(`Settings service listening on port ${port}`);
}

main().catch((err) => { console.error('Failed to start settings service:', err); process.exit(1); });
