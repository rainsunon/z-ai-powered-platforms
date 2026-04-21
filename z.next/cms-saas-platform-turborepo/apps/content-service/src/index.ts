import { startService } from '@cms/server';
import { createDatabase } from '@cms/database';
import { createCache } from '@cms/cache';
import { getHealthChecker } from '@cms/observability';
import { contentRoutes } from './routes';

startService({
  name: 'content-service',
  prefix: '/content',
  port: 3004,
  routes: contentRoutes,
  setup: async (_app, config) => {
    const db = createDatabase(config.database);
    await createCache(config.redis);
    getHealthChecker().register({ name: 'postgres', check: async () => { await db.raw('SELECT 1'); return true; } });
  },
}).catch((err) => { console.error('Failed to start content service:', err); process.exit(1); });
