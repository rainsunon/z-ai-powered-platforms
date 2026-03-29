import { cors } from 'hono/cors';
import { env } from '../config/env';

export const corsMiddleware = cors({
  origin: (origin: string | undefined) => {
    // Allow requests from the frontend
    const allowedOrigins = [
      env.CORS_ORIGIN || 'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:8080',
    ];

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return true;

    if (env.CORS_ORIGIN === '*') return '*';
    if (origin && allowedOrigins.includes(origin)) return origin;
    if (origin && origin.startsWith(env.CORS_ORIGIN)) return origin;
    return null;
  },
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposeHeaders: ['Content-Length', 'X-Total-Count'],
  maxAge: 86400, // 24 hours
});
