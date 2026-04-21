import { createService, startService } from '@cms/server';
import { createDatabase } from '@cms/database';
import { initCache } from '@cms/cache';
import { pluginRoutes } from './routes';

startService({
  name: 'plugin-service',
  prefix: '/plugins',
  port: 3011,
  routes: pluginRoutes,
  setup: async (_app, config) => {
    createDatabase(config.database);
    await initCache(config.redis);
  },
}).catch((err) => { console.error('Failed to start plugin service:', err); process.exit(1); });
