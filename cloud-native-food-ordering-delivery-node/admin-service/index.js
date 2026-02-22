import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import RestaurantSettlement from './routes/restaurantPaymentRoutes.js';
import { processWeeklySettlements } from './controllers/settlementController.js';
import cron from 'node-cron';
import redis from './utils/redis.js';
import { trackHttpRequestDuration, getMetrics, getMetricsContentType } from './utils/metrics.js';
import { traceHttpRequest } from './utils/tracing.js';

dotenv.config();

// Initialize Express
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply CORS globally
app.use(cors());

// Add metrics and tracing middleware
app.use(trackHttpRequestDuration);
app.use(traceHttpRequest);

global.gConfig = {
  auth_url: process.env.AUTH_SERVICE_URL,
  restaurant_url: process.env.RESTAURANT_SERVICE_URL,
  notification_url: process.env.NOTIFICATION_SERVICE_URL,
  order_url: process.env.ORDER_SERVICE_URL,
};

// Run every Sunday at 11:30 PM
cron.schedule(
  '30 23 * * 0',
  async () => {
    try {
      console.log('Auto-processing weekly settlements...');
      await processWeeklySettlements();
    } catch (error) {
      console.error('Auto-settlement failed:', error);
    }
  },
  {
    timezone: 'Asia/Colombo',
    name: 'WeeklySettlements',
  }
);

// Routes
app.use('/api/settlements', RestaurantSettlement);

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
  res.status(200).json({ status: 'ok', service: 'Admin Service' });
});

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5008;
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Metrics available at http://localhost:${PORT}/metrics`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(async () => {
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
  server.close(async () => {
    console.log('HTTP server closed');
    await redis.quit();
    console.log('Redis connection closed');
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});
