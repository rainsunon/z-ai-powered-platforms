import { createService, startService } from '@cms/server';
import { createDatabase } from '@cms/database';
import { initCache } from '@cms/cache';
import { aiRoutes } from './routes';

startService({
  name: 'ai-service',
  prefix: '/ai',
  port: 3015,
  routes: aiRoutes,
  setup: async (_app, config) => {
    createDatabase(config.database);
    await initCache(config.redis);
  },
}).catch((err) => { console.error('Failed to start ai service:', err); process.exit(1); });
