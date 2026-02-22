import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import paymentRoutes from './routes/paymentRoutes.js';
import redis from './utils/redis.js';
import { trackHttpRequestDuration, getMetrics, getMetricsContentType } from './utils/metrics.js';
import { traceHttpRequest } from './utils/tracing.js';

dotenv.config();

// Initialize Express
const app = express();

// Apply CORS globally
app.use(cors());

// Important: Only apply json parsing to non-webhook routes
app.use((req, res, next) => {
  if (req.originalUrl === '/api/payment/webhook') {
    next(); // Skip body parsing for webhook route
  } else {
    express.json()(req, res, next); // Apply JSON parsing to other routes
  }
});

// Add metrics and tracing middleware
app.use(trackHttpRequestDuration);
app.use(traceHttpRequest);

global.gConfig = {
  auth_url: process.env.AUTH_SERVICE_URL,
  restaurant_url: process.env.RESTAURANT_SERVICE_URL,
  notification_url: process.env.NOTIFICATION_SERVICE_URL,
  order_url: process.env.ORDER_SERVICE_URL,
};

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/payment', paymentRoutes);

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
  res.status(200).json({ status: 'ok', service: 'Payment Service' });
});

// Start Server
const PORT = process.env.PORT || 5004;
app.listen(PORT, () => {
  console.log(`Payment service running on port ${PORT}`);
  console.log(`Metrics available at http://localhost:${PORT}/metrics`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  app.close(async () => {
    console.log('HTTP server closed');
    await redis.quit();
    console.log('Redis connection closed');
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  app.close(async () => {
    console.log('HTTP server closed');
    await redis.quit();
    console.log('Redis connection closed');
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});
