import { startService } from '@cms/server';
import { createDatabase } from '@cms/database';
import { initCache } from '@cms/cache';
import { createServiceLogger } from '@cms/logger';
import { getEventBus, EventType } from '@cms/messaging';
import { notificationRoutes } from './routes';
import { initEmailTransport, processNotificationEvent } from './email';

const logger = createServiceLogger('notification-service');

startService({
  name: 'notification-service',
  prefix: '/notifications',
  port: 3008,
  routes: notificationRoutes,
  setup: async (_app, config) => {
    createDatabase(config.database);
    await initCache(config.redis);
    initEmailTransport(config.smtp);

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
  },
}).catch((err) => { console.error('Failed to start notification service:', err); process.exit(1); });
