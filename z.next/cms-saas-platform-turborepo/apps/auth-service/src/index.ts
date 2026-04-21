import { createService } from '@cms/server';
import { createDatabase } from '@cms/database';
import { initCache } from '@cms/cache';
import { getMetrics, getHealthChecker, createRequestTimer } from '@cms/observability';
import { authRoutes } from './routes';

export async function buildServer() {
  const result = await createService({
    name: 'auth-service',
    prefix: '/auth',
    port: 3001,
    routes: authRoutes,
    setup: async (_app, config) => {
      const db = createDatabase(config.database);
      await initCache(config.redis);
      const healthChecker = getHealthChecker();
      healthChecker.register({ name: 'postgres', check: async () => { await db.raw('SELECT 1'); return true; } });
    },
  });

  const { app, metrics } = result;

  app.addHook('onRequest', async (request) => {
    (request as any).timer = createRequestTimer();
  });

  app.addHook('onResponse', async (request, reply) => {
    const duration = (request as any).timer?.end() ?? 0;
    metrics.recordHistogram('http_request_duration_ms', duration, { method: request.method });
  });

  return app;
}

async function start() {
  try {
    const app = await buildServer();
    const port = Number(process.env.AUTH_SERVICE_PORT) || 3001;
    await app.listen({ port, host: '0.0.0.0' });
  } catch (err) {
    console.error('Failed to start auth service:', err);
    process.exit(1);
  }
}

start();
