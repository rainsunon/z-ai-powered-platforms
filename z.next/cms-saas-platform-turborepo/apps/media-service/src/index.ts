import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import multipart from '@fastify/multipart';
import { getConfig } from '@cms/config';
import { initDatabase } from '@cms/database';
import { initCache } from '@cms/cache';
import { createServiceLogger } from '@cms/logger';
import { createErrorHandler } from '@cms/errors';
import { initTracing, MetricsCollector } from '@cms/observability';
import { mediaRoutes } from './routes';

async function main() {
  const config = getConfig();
  const logger = createServiceLogger('media-service');

  initTracing({ serviceName: 'media-service', endpoint: config.observability?.otlpEndpoint });
  const metrics = new MetricsCollector('media_service');

  await initDatabase(config.db);
  await initCache(config.redis);

  const app = Fastify({ logger: false });

  await app.register(cors, { origin: true, credentials: true });
  await app.register(helmet);
  await app.register(multipart, {
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max
  });

  app.setErrorHandler(createErrorHandler(logger));

  app.addHook('onRequest', async (request) => {
    metrics.recordRequest(request.method, request.url);
  });

  app.get('/health', async () => ({ status: 'ok', service: 'media-service' }));
  app.get('/metrics', async () => metrics.getMetrics());

  await app.register(mediaRoutes, { prefix: '/media' });

  const port = Number(process.env.MEDIA_SERVICE_PORT) || 3005;
  await app.listen({ port, host: '0.0.0.0' });
  logger.info(`Media service listening on port ${port}`);
}

main().catch((err) => {
  console.error('Failed to start media service:', err);
  process.exit(1);
});
