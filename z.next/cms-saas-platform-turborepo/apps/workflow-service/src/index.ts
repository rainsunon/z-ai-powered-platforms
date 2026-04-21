import { startService } from '@cms/server';
import { createDatabase } from '@cms/database';
import { initCache } from '@cms/cache';
import { workflowRoutes } from './routes';

startService({
  name: 'workflow-service',
  prefix: '/workflows',
  port: 3010,
  routes: workflowRoutes,
  setup: async (_app, config) => {
    createDatabase(config.database);
    await initCache(config.redis);
  },
}).catch((err) => { console.error('Failed to start workflow service:', err); process.exit(1); });
