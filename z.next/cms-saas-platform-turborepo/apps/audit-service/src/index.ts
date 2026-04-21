import { createService, startService } from '@cms/server';
import { createDatabase } from '@cms/database';
import { initCache } from '@cms/cache';
import { getEventBus } from '@cms/messaging';
import { auditRoutes } from './routes';
import { recordAuditEvent } from './recorder';

startService({
  name: 'audit-service',
  prefix: '/audit',
  port: 3013,
  routes: auditRoutes,
  setup: async (_app, config) => {
    createDatabase(config.database);
    await initCache(config.redis);

    const eventBus = getEventBus();
    eventBus.subscribeAll(async (event) => {
      try {
        await recordAuditEvent(event);
      } catch (err) {
        console.error({ err, event: event.type }, 'Failed to record audit event');
      }
    });
  },
}).catch((err) => { console.error('Failed to start audit service:', err); process.exit(1); });
