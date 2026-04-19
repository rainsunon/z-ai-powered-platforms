import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { getServiceConfig } from '@nova-health/config';
import { getDatabase } from '@nova-health/database';

// Get service configuration
const config = getServiceConfig();

// Initialize database
const db = getDatabase(config.database.url);

// Create Hono app
const app = new Hono();

// Global middleware
app.use('*', logger());
app.use('*', prettyJSON());

// Health check endpoint
app.get('/health', (c) => {
  return c.json({
    success: true,
    service: 'admin-service',
    message: 'Admin Service is running',
    timestamp: new Date().toISOString(),
    environment: config.env,
    version: '1.0.0',
  });
});

// API routes
const api = new Hono();

// Admin routes will be added here
// api.route('/users', userRoutes);
// api.route('/roles', roleRoutes);
// api.route('/permissions', permissionRoutes);

// Mount API routes
app.route('/api', api);

// Start server
const port = config.port;

console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                              ║
║              🏥 Nova Health Admin Service                    ║
║                                                              ║
║  Environment: ${config.env.padEnd(20)}║
║  Port:        ${String(port).padEnd(20)}║
║  Database:    ${config.database.url.split('@')[1]?.split('/')[0] || 'connected'}║
║                                                              ║
║  API Base URL: http://localhost:${port}/api                 ║
║  Health Check: http://localhost:${port}/health              ║
║                                                              ║
╚════════════════════════════════════════════════════════════╝
`);

// Export for testing
export default app;
