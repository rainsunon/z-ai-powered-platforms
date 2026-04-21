import { startService } from '@cms/server';
import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import multipart from '@fastify/multipart';
import { createDatabase } from '@cms/database';
import { initCache } from '@cms/cache';
import { mediaRoutes } from './routes';

const multipartPlugin: FastifyPluginCallback = async (app: FastifyInstance) => {
  await app.register(multipart, { limits: { fileSize: 100 * 1024 * 1024 } });
};

startService({
  name: 'media-service',
  prefix: '/media',
  port: 3005,
  routes: mediaRoutes,
  plugins: [multipartPlugin],
  setup: async (_app, config) => {
    createDatabase(config.database);
    await initCache(config.redis);
  },
}).catch((err) => { console.error('Failed to start media service:', err); process.exit(1); });
