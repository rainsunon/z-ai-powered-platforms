import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { getConfig } from '@cms/config';
import { initDatabase } from '@cms/database';
import { initCache } from '@cms/cache';
import { createServiceLogger } from '@cms/logger';
import { createErrorHandler } from '@cms/errors';
import { initTracing, MetricsCollector } from '@cms/observability';
import { getEventBus, EventType } from '@cms/messaging';
import { searchRoutes } from './routes';
import { initElasticsearch, indexContent, removeContentIndex } from './elasticsearch';

async function main() {
  const config = getConfig();
  const logger = createServiceLogger('search-service');

  initTracing({ serviceName: 'search-service', endpoint: config.observability?.otlpEndpoint });
  const metrics = new MetricsCollector('search_service');

  await initDatabase(config.db);
  await initCache(config.redis);
  await initElasticsearch(config.elasticsearch);

  const app = Fastify({ logger: false });

  await app.register(cors, { origin: true, credentials: true });
  await app.register(helmet);

  app.setErrorHandler(createErrorHandler(logger));

  app.addHook('onRequest', async (request) => {
    metrics.recordRequest(request.method, request.url);
  });

  app.get('/health', async () => ({ status: 'ok', service: 'search-service' }));
  app.get('/metrics', async () => metrics.getMetrics());

  await app.register(searchRoutes, { prefix: '/search' });

  // Subscribe to content events for indexing
  const eventBus = getEventBus();
  eventBus.subscribe(EventType.CONTENT_PUBLISHED, async (event) => {
    try {
      await indexContent(event.data);
      logger.info({ contentId: event.data.contentId }, 'Content indexed');
    } catch (err) {
      logger.error({ err, event }, 'Failed to index content');
    }
  });

  eventBus.subscribe(EventType.CONTENT_DELETED, async (event) => {
    try {
      await removeContentIndex(event.data.contentId);
      logger.info({ contentId: event.data.contentId }, 'Content removed from index');
    } catch (err) {
      logger.error({ err, event }, 'Failed to remove content from index');
    }
  });

  const port = Number(process.env.SEARCH_SERVICE_PORT) || 3009;
  await app.listen({ port, host: '0.0.0.0' });
  logger.info(`Search service listening on port ${port}`);
}

main().catch((err) => {
  console.error('Failed to start search service:', err);
  process.exit(1);
});
