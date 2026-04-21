import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { getConfig } from '@cms/config';
import { initDatabase } from '@cms/database';
import { initCache } from '@cms/cache';
import { createServiceLogger } from '@cms/logger';
import { createErrorHandler } from '@cms/errors';
import { initTracing, MetricsCollector } from '@cms/observability';
import { featureFlagRoutes } from './routes';

async function main() {
  const config = getConfig();
  const logger = createServiceLogger('feature-service');

  initTracing({ serviceName: 'feature-service', endpoint: config.observability?.otlpEndpoint });
  const metrics = new MetricsCollector('feature_service');

  await initDatabase(config.db);
  await initCache(config.redis);

  const app = Fastify({ logger: false });
  await app.register(cors, { origin: true, credentials: true });
  await app.register(helmet);
  app.setErrorHandler(createErrorHandler(logger));
  app.addHook('onRequest', async (request) => { metrics.recordRequest(request.method, request.url); });
  app.get('/health', async () => ({ status: 'ok', service: 'feature-service' }));
  app.get('/metrics', async () => metrics.getMetrics());
  await app.register(featureFlagRoutes, { prefix: '/features' });

  const port = Number(process.env.FEATURE_SERVICE_PORT) || 3012;
  await app.listen({ port, host: '0.0.0.0' });
  logger.info(`Feature flag service listening on port ${port}`);
}

main().catch((err) => { console.error('Failed to start feature service:', err); process.exit(1); });
