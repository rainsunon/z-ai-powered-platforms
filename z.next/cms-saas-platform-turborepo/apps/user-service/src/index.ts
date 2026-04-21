import { startService } from '@cms/server';
import { createDatabase, getDatabase } from '@cms/database';
import { createCache } from '@cms/cache';
import { getHealthChecker } from '@cms/observability';
import { userRoutes } from './routes';

startService({
  name: 'user-service',
  prefix: '/users',
  port: 3002,
  routes: userRoutes,
  setup: async (_app, config) => {
    const db = createDatabase(config.database);
    await createCache(config.redis);
    getHealthChecker().register({ name: 'postgres', check: async () => { await db.raw('SELECT 1'); return true; } });
  },
}).catch((err) => { console.error('Failed to start user service:', err); process.exit(1); });
