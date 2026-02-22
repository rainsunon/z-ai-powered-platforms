import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import notificationRoutes from './routes/notificationRoutes.js';
import { startRegistrationConsumer } from './consumers/notificationConsumer.js';
import redis from './utils/redis.js';
import { trackHttpRequestDuration, getMetrics, getMetricsContentType } from './utils/metrics.js';
import { traceHttpRequest } from './utils/tracing.js';

// Load environment variables
dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: '*',
  })
);

// Add metrics and tracing middleware
app.use(trackHttpRequestDuration);
app.use(traceHttpRequest);

global.gConfig = {
  auth_url: process.env.AUTH_SERVICE_URL,
  restaurant_url: process.env.RESTAURANT_SERVICE_URL,
  notification_url: process.env.NOTIFICATION_SERVICE_URL,
  order_url: process.env.ORDER_SERVICE_URL,
};

// Routes
app.use('/api/notifications', notificationRoutes);

// Metrics endpoint for Prometheus
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', getMetricsContentType());
    res.end(await getMetrics());
  } catch (error) {
    console.error('Error getting metrics:', error);
    res.status(500).end();
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'Notification Service' });
});

// Start Kafka consumer
startRegistrationConsumer();

// Start server
const PORT = process.env.PORT || 5007;
const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`Metrics available at http://localhost:${PORT}/metrics`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(async () => {
    console.log('HTTP server closed');
    await redis.quit();
    console.log('Redis connection closed');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(async () => {
    console.log('HTTP server closed');
    await redis.quit();
    console.log('Redis connection closed');
    process.exit(0);
  });
});
