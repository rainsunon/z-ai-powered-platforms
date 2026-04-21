import Fastify, { FastifyInstance, FastifyPluginCallback } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { getConfig, AppConfig } from '@cms/config';
import { createServiceLogger } from '@cms/logger';
import { createErrorHandler, ErrorHandlerLogger } from '@cms/errors';
import { initTracing, MetricsCollector, HealthChecker, getHealthChecker } from '@cms/observability';

export interface ServiceConfig {
  name: string;
  routes: (app: FastifyInstance) => Promise<void>;
  prefix: string;
  port: number;
  trustProxy?: boolean;
  plugins?: FastifyPluginCallback[];
  setup?: (app: FastifyInstance, config: AppConfig) => Promise<void>;
  corsOrigin?: string | boolean | string[];
  requestIdHeader?: string;
}

export interface ServiceResult {
  app: FastifyInstance;
  config: AppConfig;
  logger: ErrorHandlerLogger & { info: (obj: Record<string, unknown>, msg?: string) => void; fatal: (obj: Record<string, unknown>, msg?: string) => void };
  metrics: MetricsCollector;
  healthChecker: HealthChecker;
}

export async function createService(serviceConfig: ServiceConfig): Promise<ServiceResult> {
  const config = getConfig();
  const serviceName = serviceConfig.name;
  const logger = createServiceLogger(serviceName);
  const metrics = new MetricsCollector(serviceName.replace(/-/g, '_'));
  const healthChecker = getHealthChecker();

  initTracing({ serviceName });

  const app = Fastify({
    logger: false,
    trustProxy: serviceConfig.trustProxy ?? true,
    requestIdHeader: serviceConfig.requestIdHeader ?? 'x-request-id',
  });

  const corsOrigin = serviceConfig.corsOrigin ?? config.isDevelopment;
  await app.register(cors, {
    origin: corsOrigin,
    credentials: typeof corsOrigin === 'boolean' ? corsOrigin : true,
  });

  await app.register(helmet, {
    contentSecurityPolicy: config.isProduction,
  });

  app.setErrorHandler(createErrorHandler(logger));

  app.addHook('onRequest', async (request) => {
    metrics.incrementCounter('http_requests', { method: request.method, url: request.url });
  });

  app.addHook('onResponse', async (request, reply) => {
    metrics.incrementCounter('http_responses', { method: request.method, status: String(reply.statusCode) });
    logger.info(
      { method: request.method, url: request.url, statusCode: reply.statusCode, requestId: request.id },
      'Request completed',
    );
  });

  app.get('/health', async () => healthChecker.check());
  app.get('/metrics', async () => metrics.getMetrics());

  if (serviceConfig.plugins) {
    for (const plugin of serviceConfig.plugins) {
      await app.register(plugin);
    }
  }

  await app.register(serviceConfig.routes, { prefix: serviceConfig.prefix });

  if (serviceConfig.setup) {
    await serviceConfig.setup(app, config);
  }

  return { app, config, logger, metrics, healthChecker };
}

export async function startService(serviceConfig: ServiceConfig): Promise<void> {
  const { app, logger } = await createService(serviceConfig);
  const envKey = `${serviceConfig.name.replace(/-/g, '_').toUpperCase()}_PORT`;
  const port = Number(process.env[envKey]) || serviceConfig.port;

  await app.listen({ port, host: '0.0.0.0' });
  logger.info({ port }, `${serviceConfig.name} started`);
}

export { Fastify, FastifyInstance, FastifyPluginCallback };
