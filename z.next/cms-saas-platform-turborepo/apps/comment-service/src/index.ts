import { startService } from '@cms/server';
import { createDatabase } from '@cms/database';
import { initCache } from '@cms/cache';
import { commentRoutes } from './routes';

startService({
  name: 'comment-service',
  prefix: '/comments',
  port: 3006,
  routes: commentRoutes,
  setup: async (_app, config) => {
    createDatabase(config.database);
    await initCache(config.redis);
  },
}).catch((err) => { console.error('Failed to start comment service:', err); process.exit(1); });
