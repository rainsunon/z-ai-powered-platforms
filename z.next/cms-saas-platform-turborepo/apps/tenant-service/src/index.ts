import { startService } from '@cms/server';
import { createDatabase } from '@cms/database';
import { createCache } from '@cms/cache';
import { getHealthChecker } from '@cms/observability';
import { tenantRoutes } from './routes';

startService({
  name: 'tenant-service',
  prefix: '/tenants',
  port: 3003,
  routes: tenantRoutes,
  setup: async (_app, config) => {
    const db = createDatabase(config.database);
    await createCache(config.redis);
    getHealthChecker().register({ name: 'postgres', check: async () => { await db.raw('SELECT 1'); return true; } });
  },
}).catch((err) => { console.error('Failed to start tenant service:', err); process.exit(1); });
