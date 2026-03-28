import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { cors } from 'hono/cors';
import { serveStatic } from 'hono/bun';
import { env } from './config/env';
import { db } from './config/database';
import {
  errorMiddleware,
  notFoundHandler,
  corsMiddleware,
  rateLimits,
} from './middleware';
import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/users';
import { appointmentRoutes } from './routes/appointments';
import { medicationRoutes } from './routes/medications';
import { familyRoutes } from './routes/family';
import { billingRoutes } from './routes/billing';
import { healthRoutes } from './routes/health';
import { communicationRoutes } from './routes/communications';
import { supportRoutes } from './routes/support';
import { adminRoutes } from './routes/admin';

// Create Hono app
const app = new Hono();

// Global middleware
app.use('*', logger());
app.use('*', prettyJSON());
app.use('*', corsMiddleware);

// Health check endpoint
app.get('/health', (c) => {
  return c.json({
    success: true,
    message: 'Nova Health API is running',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    version: '1.0.0',
  });
});

// API routes
const api = new Hono();

// Apply rate limiting to all API routes
api.use('*', rateLimits.api);

// Auth routes (with stricter rate limiting)
api.route('/auth', authRoutes);

// Protected routes (require authentication)
import { authMiddleware } from './middleware/auth';
api.use('/users/*', authMiddleware);
api.use('/appointments/*', authMiddleware);
api.use('/medications/*', authMiddleware);
api.use('/family/*', authMiddleware);
api.use('/billing/*', authMiddleware);
api.use('/health/*', authMiddleware);
api.use('/communications/*', authMiddleware);
api.use('/support/*', authMiddleware);
api.use('/admin/*', authMiddleware);

// Feature routes
api.route('/users', userRoutes);
api.route('/appointments', appointmentRoutes);
api.route('/medications', medicationRoutes);
api.route('/family', familyRoutes);
api.route('/billing', billingRoutes);
api.route('/health', healthRoutes);
api.route('/communications', communicationRoutes);
api.route('/support', supportRoutes);
api.route('/admin', adminRoutes);

// Mount API routes
app.route('/api', api);

// Error handling middleware (must be last)
app.use('*', errorMiddleware);

// 404 handler
app.notFound(notFoundHandler);

// Start server
const port = env.PORT || 3001;

console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                              ║
║              🏥 Nova Health API Server                      ║
║                                                              ║
║  Environment: ${env.NODE_ENV.padEnd(20)}║
║  Port:        ${String(port).padEnd(20)}║
║  Database:    ${env.DATABASE_URL.split('@')[1]?.split('/')[0] || 'connected'}║
║                                                              ║
║  API Base URL: http://localhost:${port}/api                 ║
║  Health Check: http://localhost:${port}/health              ║
║                                                              ║
╚════════════════════════════════════════════════════════════╝
`);

// Export for testing
export default app;
