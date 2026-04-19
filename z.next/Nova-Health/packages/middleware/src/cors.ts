import { cors } from 'hono/cors';
import { getServiceConfig } from '@nova-health/config';

export const corsMiddleware = cors({
  origin: (origin: string | undefined) => {
    // Allow requests from the frontend
    const config = getServiceConfig();
    const allowedOrigins = [
      config.cors.origin,
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:8080',
    ];

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return true;

    if (config.cors.origin === '*') return '*';
    if (origin && allowedOrigins.includes(origin)) return origin;
    if (origin && origin.startsWith(config.cors.origin)) return origin;
    return null;
  },
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposeHeaders: ['Content-Length', 'X-Total-Count'],
  maxAge: 86400, // 24 hours
});
