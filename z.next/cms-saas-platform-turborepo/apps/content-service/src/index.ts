import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { getConfig } from '@cms/config';
import { createServiceLogger } from '@cms/logger';
import { createDatabase } from '@cms/database';
import { AppError, serializeError } from '@cms/errors';
import { getHealthChecker } from '@cms/observability';
import { createCache } from '@cms/cache';
import { contentRoutes } from './routes';

const logger = createServiceLogger('content-service');

async function start() {
  const config = getConfig();
  const app = Fastify({ logger: false, trustProxy: true });

  await app.register(cors, { origin: config.isDevelopment });
  await app.register(helmet);

  const db = createDatabase(config.database);
  await createCache(config.redis);
  getHealthChecker().register({ name: 'postgres', check: async () => { await db.raw('SELECT 1'); return true; } });

  app.setErrorHandler(async (error, _req, reply) => {
    if (error instanceof AppError) return reply.status(error.statusCode).send(serializeError(error, config.isDevelopment));
    logger.error({ err: error }, 'Unhandled error');
    return reply.status(500).send({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error', statusCode: 500 } });
  });

  app.get('/health', async () => getHealthChecker().check());
  await app.register(contentRoutes, { prefix: '/content' });

  const port = Number(process.env.CONTENT_SERVICE_PORT) || 3004;
  await app.listen({ port, host: '0.0.0.0' });
  logger.info({ port }, 'Content service started');
}

start().catch((err) => { console.error(err); process.exit(1); });
