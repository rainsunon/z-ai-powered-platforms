import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { getServiceConfig } from '@nova-health/config';
import { notificationRoutes } from './routes/notifications';

// Get service configuration
const config = getServiceConfig();

// Create Hono app
const app = new Hono();

// Global middleware
app.use('*', logger());
app.use('*', prettyJSON());

// Mount notification routes
app.route('/api/notifications', notificationRoutes);

// Health check
app.get('/health', (c) => {
  return c.json({
    success: true,
    service: 'notification-service',
    message: 'Notification Service is running',
    timestamp: new Date().toISOString(),
    environment: config.env,
    version: '1.0.0',
  });
});

// Start server
const port = config.port;

console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                              ║
║              🏥 Nova Health Notification Service              ║
║                                                              ║
║  Environment: ${config.env.padEnd(20)}║
║  Port:        ${String(port).padEnd(20)}║
║                                                              ║
║  API Base URL: http://localhost:${port}/api/notifications     ║
║  Health Check: http://localhost:${port}/health               ║
║                                                              ║
╚════════════════════════════════════════════════════════════╝
`);

// Export for testing
export default app;
