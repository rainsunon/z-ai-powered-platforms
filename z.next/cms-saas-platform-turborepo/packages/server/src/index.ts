import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { serve } from '@hono/node-server';
import { getConfig, AppConfig } from '@cms/config';
import { createServiceLogger } from '@cms/logger';
import { createErrorHandler, ErrorHandlerLogger } from '@cms/errors';
import { MetricsCollector, HealthChecker, getHealthChecker } from '@cms/observability';

type MaybePromise<T> = T | Promise<T>;

export interface ServiceRequest {
  method: string;
  url: string;
  headers: Record<string, any>;
  query: Record<string, any>;
  params: Record<string, any>;
  body: any;
  ip: string;
  id: string;
  file: () => Promise<{ filename: string; toBuffer: () => Promise<Buffer> } | null>;
  [key: string]: unknown;
}

export interface ServiceReply {
  statusCode: number;
  headers: Record<string, string>;
  status: (code: number) => ServiceReply;
  code: (code: number) => ServiceReply;
  send: (payload?: unknown) => ServiceReply;
  header: (name: string, value: string | number) => ServiceReply;
}

export type ServiceHandler = (request: ServiceRequest, reply: ServiceReply) => MaybePromise<unknown>;
export type ServicePreHandler = (request: ServiceRequest, reply: ServiceReply) => MaybePromise<void>;

export interface ServiceRouteOptions {
  preHandler?: ServicePreHandler[];
}

export interface ServiceApp {
  get: <T = unknown>(path: string, optionsOrHandler: ServiceRouteOptions | ServiceHandler, handlerMaybe?: ServiceHandler) => void;
  post: <T = unknown>(path: string, optionsOrHandler: ServiceRouteOptions | ServiceHandler, handlerMaybe?: ServiceHandler) => void;
  put: <T = unknown>(path: string, optionsOrHandler: ServiceRouteOptions | ServiceHandler, handlerMaybe?: ServiceHandler) => void;
  patch: <T = unknown>(path: string, optionsOrHandler: ServiceRouteOptions | ServiceHandler, handlerMaybe?: ServiceHandler) => void;
  delete: <T = unknown>(path: string, optionsOrHandler: ServiceRouteOptions | ServiceHandler, handlerMaybe?: ServiceHandler) => void;
}

export type FastifyPluginCallback = (app: ServiceApp) => MaybePromise<void>;

export interface ServiceConfig {
  name: string;
  routes: (app: ServiceApp) => Promise<void>;
  prefix: string;
  port: number;
  trustProxy?: boolean;
  plugins?: FastifyPluginCallback[];
  setup?: (app: ServiceApp, config: AppConfig) => Promise<void>;
  corsOrigin?: string | boolean | string[];
  requestIdHeader?: string;
}

export interface ServiceResult {
  app: Hono;
  config: AppConfig;
  logger: ErrorHandlerLogger & { info: (obj: Record<string, unknown>, msg?: string) => void; fatal: (obj: Record<string, unknown>, msg?: string) => void };
  metrics: MetricsCollector;
  healthChecker: HealthChecker;
}

function normalizePath(prefix: string, path: string): string {
  const pfx = prefix === '/' ? '' : prefix.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${pfx}${p}` || '/';
}

function parseFormUrlEncoded(text: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const chunk of text.split('&')) {
    if (!chunk) continue;
    const [rawKey, rawVal = ''] = chunk.split('=');
    const key = decodeURIComponent(rawKey.replace(/\+/g, ' '));
    const value = decodeURIComponent(rawVal.replace(/\+/g, ' '));
    result[key] = value;
  }
  return result;
}

async function parseBody(c: any): Promise<unknown> {
  const contentType = c.req.header('content-type') ?? '';
  if (contentType.includes('application/json')) {
    try {
      return await c.req.json();
    } catch {
      return {};
    }
  }

  if (contentType.includes('application/x-www-form-urlencoded')) {
    const text = await c.req.text();
    return parseFormUrlEncoded(text);
  }

  if (contentType.includes('multipart/form-data')) {
    return {};
  }

  return {};
}

function createReply(): ServiceReply & { __sent: boolean; __body: unknown } {
  const state: ServiceReply & { __sent: boolean; __body: unknown } = {
    statusCode: 200,
    headers: {},
    __sent: false,
    __body: undefined,
    status(code: number) {
      state.statusCode = code;
      return state;
    },
    code(code: number) {
      state.statusCode = code;
      return state;
    },
    send(payload?: unknown) {
      state.__body = payload;
      state.__sent = true;
      return state;
    },
    header(name: string, value: string | number) {
      state.headers[name] = String(value);
      return state;
    },
  };

  return state;
}

function finalizeResponse(c: any, reply: ReturnType<typeof createReply>, fallbackBody?: unknown): any {
  const body = reply.__sent ? reply.__body : fallbackBody;
  for (const [key, value] of Object.entries(reply.headers)) {
    c.header(key, value);
  }

  if (body === undefined || body === null) {
    c.status(reply.statusCode);
    return c.body(null);
  }

  if (typeof body === 'string') {
    c.status(reply.statusCode);
    return c.text(body);
  }

  c.status(reply.statusCode);
  return c.json(body);
}

function createServiceApp(
  app: Hono,
  prefix: string,
  requestIdHeader: string,
  metrics: MetricsCollector,
  logger: ErrorHandlerLogger & { info: (obj: Record<string, unknown>, msg?: string) => void },
  errorHandler: ReturnType<typeof createErrorHandler>,
): ServiceApp {
  const register = (
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    path: string,
    optionsOrHandler: ServiceRouteOptions | ServiceHandler,
    handlerMaybe?: ServiceHandler,
  ) => {
    const options = typeof optionsOrHandler === 'function' ? {} : optionsOrHandler;
    const handler = (typeof optionsOrHandler === 'function' ? optionsOrHandler : handlerMaybe) as ServiceHandler;

    app.on(method, normalizePath(prefix, path), async (c: any) => {
      const requestId = c.req.header(requestIdHeader) ?? `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const headers: Record<string, string> = {};
      c.req.raw.headers.forEach((value: string, key: string) => {
        headers[key] = value;
      });

      const formDataPromise = c.req.header('content-type')?.includes('multipart/form-data')
        ? c.req.formData().catch(() => null)
        : Promise.resolve<any>(null);

      const request: ServiceRequest = {
        method: c.req.method,
        url: c.req.url,
        headers,
        query: c.req.query(),
        params: c.req.param(),
        body: await parseBody(c),
        ip: headers['x-forwarded-for']?.split(',')[0]?.trim() ?? headers['x-real-ip'] ?? 'unknown',
        id: requestId,
        file: async () => {
          const formData = await formDataPromise;
          if (!formData) return null;

          for (const value of formData.values()) {
            if (typeof File !== 'undefined' && value instanceof File) {
              return {
                filename: value.name,
                toBuffer: async () => Buffer.from(await value.arrayBuffer()),
              };
            }
          }

          return null;
        },
      };

      const reply = createReply();
      metrics.incrementCounter('http_requests', { method: request.method, url: request.url });

      try {
        for (const pre of options.preHandler ?? []) {
          await pre(request, reply);
          if (reply.__sent) {
            return finalizeResponse(c, reply);
          }
        }

        const result = await handler(request, reply);
        return finalizeResponse(c, reply, result);
      } catch (error) {
        await errorHandler(error as Error, request, reply);
        return finalizeResponse(c, reply);
      } finally {
        metrics.incrementCounter('http_responses', { method: request.method, status: String(reply.statusCode) });
        logger.info(
          { method: request.method, url: request.url, statusCode: reply.statusCode, requestId: request.id },
          'Request completed',
        );
      }
    });
  };

  return {
    get: (path, optionsOrHandler, handlerMaybe) => register('GET', path, optionsOrHandler, handlerMaybe),
    post: (path, optionsOrHandler, handlerMaybe) => register('POST', path, optionsOrHandler, handlerMaybe),
    put: (path, optionsOrHandler, handlerMaybe) => register('PUT', path, optionsOrHandler, handlerMaybe),
    patch: (path, optionsOrHandler, handlerMaybe) => register('PATCH', path, optionsOrHandler, handlerMaybe),
    delete: (path, optionsOrHandler, handlerMaybe) => register('DELETE', path, optionsOrHandler, handlerMaybe),
  };
}

export async function createService(serviceConfig: ServiceConfig): Promise<ServiceResult> {
  const config = getConfig();
  const serviceName = serviceConfig.name;
  const logger = createServiceLogger(serviceName);
  const metrics = new MetricsCollector(serviceName.replace(/-/g, '_'));
  const healthChecker = getHealthChecker();
  const errorHandler = createErrorHandler(logger);

  const app = new Hono();
  const requestIdHeader = serviceConfig.requestIdHeader ?? 'x-request-id';

  const corsOrigin = serviceConfig.corsOrigin ?? config.isDevelopment;
  app.use('*', cors({
    origin: corsOrigin,
    credentials: typeof corsOrigin === 'boolean' ? corsOrigin : true,
  }));

  app.use('*', secureHeaders({
    contentSecurityPolicy: config.isProduction ? undefined : false,
  }));

  const serviceApp = createServiceApp(app, serviceConfig.prefix, requestIdHeader, metrics, logger, errorHandler);

  app.get('/health', async (c: any) => {
    return c.json(await healthChecker.check());
  });

  app.get('/metrics', async (c: any) => {
    return c.text(await metrics.getMetrics());
  });

  if (serviceConfig.plugins) {
    for (const plugin of serviceConfig.plugins) {
      await plugin(serviceApp);
    }
  }

  await serviceConfig.routes(serviceApp);

  if (serviceConfig.setup) {
    await serviceConfig.setup(serviceApp, config);
  }

  return { app, config, logger, metrics, healthChecker };
}

export async function startService(serviceConfig: ServiceConfig): Promise<void> {
  const { app, logger } = await createService(serviceConfig);
  const envKey = `${serviceConfig.name.replace(/-/g, '_').toUpperCase()}_PORT`;
  const port = Number(process.env[envKey]) || serviceConfig.port;

  serve({ fetch: app.fetch, port, hostname: '0.0.0.0' });
  logger.info({ port }, `${serviceConfig.name} started`);
}

export type FastifyInstance = ServiceApp;
