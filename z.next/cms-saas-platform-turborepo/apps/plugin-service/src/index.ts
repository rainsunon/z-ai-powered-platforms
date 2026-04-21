import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { getConfig } from '@cms/config';
import { initDatabase } from '@cms/database';
import { initCache } from '@cms/cache';
import { createServiceLogger } from '@cms/logger';
import { createErrorHandler } from '@cms/errors';
import { initTracing, MetricsCollector } from '@cms/observability';
import { pluginRoutes } from './routes';

async function main() {
  const config = getConfig();
  const logger = createServiceLogger('plugin-service');

  initTracing({ serviceName: 'plugin-service', endpoint: config.observability?.otlpEndpoint });
  const metrics = new MetricsCollector('plugin_service');

  await initDatabase(config.db);
  await initCache(config.redis);

  const app = Fastify({ logger: false });

  await app.register(cors, { origin: true, credentials: true });
  await app.register(helmet);

  app.setErrorHandler(createErrorHandler(logger));

  app.addHook('onRequest', async (request) => {
    metrics.recordRequest(request.method, request.url);
  });

  app.get('/health', async () => ({ status: 'ok', service: 'plugin-service' }));
  app.get('/metrics', async () => metrics.getMetrics());

  await app.register(pluginRoutes, { prefix: '/plugins' });

  const port = Number(process.env.PLUGIN_SERVICE_PORT) || 3011;
  await app.listen({ port, host: '0.0.0.0' });
  logger.info(`Plugin service listening on port ${port}`);
}

main().catch((err) => {
  console.error('Failed to start plugin service:', err);
  process.exit(1);
});
