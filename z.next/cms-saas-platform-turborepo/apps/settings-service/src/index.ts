import { createService, startService } from '@cms/server';
import { createDatabase } from '@cms/database';
import { initCache } from '@cms/cache';
import { settingsRoutes } from './routes';

startService({
  name: 'settings-service',
  prefix: '/settings',
  port: 3014,
  routes: settingsRoutes,
  setup: async (_app, config) => {
    createDatabase(config.database);
    await initCache(config.redis);
  },
}).catch((err) => { console.error('Failed to start settings service:', err); process.exit(1); });
