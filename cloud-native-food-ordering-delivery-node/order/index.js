import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import http from 'http';
import orderRoutes from './routes/orderRoute.js';
import cartRoutes from './routes/cartRoute.js';
import { setupWebSocket } from './websocket.js';
import redis from './utils/redis.js';
import { trackHttpRequestDuration, getMetrics, getMetricsContentType } from './utils/metrics.js';
import { traceHttpRequest } from './utils/tracing.js';

dotenv.config();
const app = express();

// Create HTTP server for WebSocket support
const server = http.createServer(app);

// Middleware
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// Add metrics and tracing middleware
app.use(trackHttpRequestDuration);
app.use(traceHttpRequest);

// Set global configuration for service URLs
global.gConfig = {
  auth_url: process.env.AUTH_SERVICE_URL,
  restaurant_url: process.env.RESTAURANT_SERVICE_URL,
  notification_url: process.env.NOTIFICATION_SERVICE_URL,
  admin_url: process.env.ADMIN_SERVICE_URL,
};

// Routes
app.use('/api/orders/', orderRoutes);
app.use('/api/cart', cartRoutes);

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
  res.status(200).json({ status: 'ok', service: 'Order Service' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? 'Server error' : err.message,
  });
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

const PORT = process.env.PORT || 5002;
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    // Initialize and setup WebSocket server
    const wss = setupWebSocket(server);

    // Start HTTP server instead of Express app directly
    server.listen(PORT, () => {
      console.log(`Order Service is running on port ${PORT}`);
      console.log(
        `WebSocket server is running on ws://localhost:${PORT}/ws/orders/:id`
      );
      console.log(`Metrics available at http://localhost:${PORT}/metrics`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
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
