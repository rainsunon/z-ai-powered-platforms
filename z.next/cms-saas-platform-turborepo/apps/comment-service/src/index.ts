import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { getConfig } from '@cms/config';
import { initDatabase } from '@cms/database';
import { initCache } from '@cms/cache';
import { createServiceLogger } from '@cms/logger';
import { createErrorHandler } from '@cms/errors';
import { initTracing, MetricsCollector } from '@cms/observability';
import { commentRoutes } from './routes';

async function main() {
  const config = getConfig();
  const logger = createServiceLogger('comment-service');

  initTracing({ serviceName: 'comment-service', endpoint: config.observability?.otlpEndpoint });
  const metrics = new MetricsCollector('comment_service');

  await initDatabase(config.db);
  await initCache(config.redis);

  const app = Fastify({ logger: false });

  await app.register(cors, { origin: true, credentials: true });
  await app.register(helmet);

  app.setErrorHandler(createErrorHandler(logger));

  app.addHook('onRequest', async (request) => {
    metrics.recordRequest(request.method, request.url);
  });

  app.get('/health', async () => ({ status: 'ok', service: 'comment-service' }));
  app.get('/metrics', async () => metrics.getMetrics());

  await app.register(commentRoutes, { prefix: '/comments' });

  const port = Number(process.env.COMMENT_SERVICE_PORT) || 3006;
  await app.listen({ port, host: '0.0.0.0' });
  logger.info(`Comment service listening on port ${port}`);
}

main().catch((err) => {
  console.error('Failed to start comment service:', err);
  process.exit(1);
});
