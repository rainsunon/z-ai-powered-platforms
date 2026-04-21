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
import { notificationRoutes } from './routes';
import { initEmailTransport, processNotificationEvent } from './email';

async function main() {
  const config = getConfig();
  const logger = createServiceLogger('notification-service');

  initTracing({ serviceName: 'notification-service', endpoint: config.observability?.otlpEndpoint });
  const metrics = new MetricsCollector('notification_service');

  await initDatabase(config.db);
  await initCache(config.redis);
  initEmailTransport(config.email);

  const app = Fastify({ logger: false });

  await app.register(cors, { origin: true, credentials: true });
  await app.register(helmet);

  app.setErrorHandler(createErrorHandler(logger));

  app.addHook('onRequest', async (request) => {
    metrics.recordRequest(request.method, request.url);
  });

  app.get('/health', async () => ({ status: 'ok', service: 'notification-service' }));
  app.get('/metrics', async () => metrics.getMetrics());

  await app.register(notificationRoutes, { prefix: '/notifications' });

  // Subscribe to events for auto-notifications
  const eventBus = getEventBus();
  for (const eventType of [
    EventType.CONTENT_PUBLISHED,
    EventType.COMMENT_CREATED,
    EventType.USER_REGISTERED,
    EventType.WORKFLOW_STEP_COMPLETED,
  ]) {
    eventBus.subscribe(eventType, async (event) => {
      await processNotificationEvent(event, logger);
    });
  }

  const port = Number(process.env.NOTIFICATION_SERVICE_PORT) || 3008;
  await app.listen({ port, host: '0.0.0.0' });
  logger.info(`Notification service listening on port ${port}`);
}

main().catch((err) => {
  console.error('Failed to start notification service:', err);
  process.exit(1);
});
