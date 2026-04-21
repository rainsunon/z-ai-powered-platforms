import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { getConfig } from '@cms/config';
import { createServiceLogger } from '@cms/logger';
import { createDatabase } from '@cms/database';
import { AppError, serializeError } from '@cms/errors';
import { getMetrics, getHealthChecker } from '@cms/observability';
import { createCache } from '@cms/cache';
import { userRoutes } from './routes';

const logger = createServiceLogger('user-service');

async function start() {
  const config = getConfig();
  const app = Fastify({ logger: false, trustProxy: true });

  await app.register(cors, { origin: config.isDevelopment });
  await app.register(helmet);

  const db = createDatabase(config.database);
  await createCache(config.redis);
  const healthChecker = getHealthChecker();
  healthChecker.register({ name: 'postgres', check: async () => { await db.raw('SELECT 1'); return true; } });

  app.setErrorHandler(async (error, _req, reply) => {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send(serializeError(error, config.isDevelopment));
    }
    logger.error({ err: error }, 'Unhandled error');
    return reply.status(500).send({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error', statusCode: 500 } });
  });

  app.get('/health', async () => healthChecker.check());
  await app.register(userRoutes, { prefix: '/users' });

  const port = Number(process.env.USER_SERVICE_PORT) || 3002;
  await app.listen({ port, host: '0.0.0.0' });
  logger.info({ port }, 'User service started');
}

start().catch((err) => {
  console.error('Failed to start user service:', err);
  process.exit(1);
});
