import { createService, startService } from '@cms/server';
import { createDatabase } from '@cms/database';
import { initCache } from '@cms/cache';
import { featureFlagRoutes } from './routes';

startService({
  name: 'feature-service',
  prefix: '/features',
  port: 3012,
  routes: featureFlagRoutes,
  setup: async (_app, config) => {
    createDatabase(config.database);
    await initCache(config.redis);
  },
}).catch((err) => { console.error('Failed to start feature service:', err); process.exit(1); });
