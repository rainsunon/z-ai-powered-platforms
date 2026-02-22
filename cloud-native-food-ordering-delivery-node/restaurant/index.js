import express from 'express';
import cors from 'cors';
import BodyParser from 'body-parser';
import mongoose from 'mongoose';
import { MONGOURL, PORT } from './config.js';
import dotenv from 'dotenv';
import Owner from './Routes/ResturantOwnerRoute.js';
import Admin from './routes/branchAdminRoute.js';
import redis from './utils/redis.js';
import { trackHttpRequestDuration, getMetrics, getMetricsContentType } from './utils/metrics.js';
import { traceHttpRequest } from './utils/tracing.js';

const app = express();
dotenv.config();

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

global.gConfig = {
  orders_url: process.env.ORDERS_SERVICE_URL || 'http://localhost:5002',
  notification_url: process.env.NOTIFICATION_SERVICE_URL,
  auth_url: process.env.AUTH_SERVICE_URL || 'http://localhost:5001',
};

// Add metrics and tracing middleware
app.use(trackHttpRequestDuration);
app.use(traceHttpRequest);

app.use(express.json());
app.use(BodyParser.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', Owner);
app.use('/api/branch', Admin);

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
  res.status(200).json({ status: 'ok', service: 'Restaurant Service' });
});

const startServer = async () => {
  try {
    await mongoose.connect(MONGOURL);
    console.log('✅ Database Connected Successfully');

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server is Running on Port ${PORT}`);
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
  } catch (error) {
    console.error('❌ Error connecting to database:', error);
  }
};
startServer();
