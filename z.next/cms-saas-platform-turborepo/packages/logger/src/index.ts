import pino from 'pino';

export type LogLevel = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';

export interface LogContext {
  tenantId?: string;
  userId?: string;
  requestId?: string;
  service?: string;
  [key: string]: unknown;
}

function createLogger(options?: { level?: LogLevel; service?: string; pretty?: boolean }) {
  const level = options?.level ?? (process.env.LOG_LEVEL as LogLevel) ?? 'info';
  const service = options?.service ?? process.env.SERVICE_NAME ?? 'cms';
  const isDev = process.env.NODE_ENV !== 'production';
  const pretty = options?.pretty ?? isDev;

  const transport = pretty
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      }
    : undefined;

  return pino({
    level,
    transport,
    base: { service },
    timestamp: pino.stdTimeFunctions.isoTime,
    serializers: {
      err: pino.stdSerializers.err,
      req: pino.stdSerializers.req,
      res: pino.stdSerializers.res,
    },
    redact: {
      paths: [
        'password',
        'secret',
        'token',
        'authorization',
        'cookie',
        'req.headers.authorization',
        'req.headers.cookie',
      ],
      censor: '[REDACTED]',
    },
  });
}

export type Logger = ReturnType<typeof createLogger>;

let _defaultLogger: Logger | null = null;

export function getLogger(options?: { level?: LogLevel; service?: string; pretty?: boolean }): Logger {
  if (!_defaultLogger) {
    _defaultLogger = createLogger(options);
  }
  return _defaultLogger;
}

export function createServiceLogger(service: string, level?: LogLevel): Logger {
  return createLogger({ service, level });
}

export function createChildLogger(parent: Logger, context: LogContext): Logger {
  return parent.child(context) as Logger;
}

export { createLogger };
