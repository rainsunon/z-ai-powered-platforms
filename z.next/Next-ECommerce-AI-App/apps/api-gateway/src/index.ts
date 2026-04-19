import express, { type Express } from "express";
import helmet from "helmet";
import { gatewayConfig } from "./config/services.js";
import { logger } from "./utils/logger.js";
import { corsMiddleware } from "./middleware/cors.js";
import { requestLogger } from "./middleware/logging.js";
import { globalRateLimiter } from "./middleware/rateLimit.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { authMiddleware } from "./middleware/auth.js";
import { auditMiddleware } from "./middleware/audit.js";
import healthRouter from "./routes/health.js";
import proxyRouter from "./routes/proxy.js";
import { producer } from "./utils/kafka.js";

const app: Express = express();

// Security middleware
app.use(helmet());

// CORS
app.use(corsMiddleware);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(requestLogger);

// Global rate limiting
app.use(globalRateLimiter);

// NOTE: Clerk authentication is applied per-route in proxy.ts based on route config
// This allows public routes to work without auth while protecting private routes

// Audit logging middleware
app.use(auditMiddleware);

// Health check routes (no auth required)
app.use(healthRouter);

// Proxy routes to microservices
app.use(proxyRouter);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = gatewayConfig.port;

const startServer = async () => {
  try {
    // Connect to Kafka
    await producer.connect();

    logger.info("Connected to Kafka");

    app.listen(PORT, () => {
      logger.info(`API Gateway started on port ${PORT}`);
      logger.info(`Environment: ${gatewayConfig.nodeEnv}`);
      logger.info("Available routes:");
      logger.info("  GET  /health - Gateway health check");
      logger.info("  GET  /health/services - Services health check");
      logger.info("  *    /api/* - Proxied to microservices");
    });

  } catch (error) {
    logger.error("Failed to start API Gateway", { error });
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  logger.info("SIGINT received, shutting down gracefully");
  process.exit(0);
});

export default app;
