import { startService } from '@cms/server';
import { createDatabase } from '@cms/database';
import { initCache } from '@cms/cache';
import { mediaRoutes } from './routes';

startService({
  name: 'media-service',
  prefix: '/media',
  port: 3005,
  routes: mediaRoutes,
  setup: async (_app, config) => {
    createDatabase(config.database);
    await initCache(config.redis);
  },
}).catch((err) => { console.error('Failed to start media service:', err); process.exit(1); });
