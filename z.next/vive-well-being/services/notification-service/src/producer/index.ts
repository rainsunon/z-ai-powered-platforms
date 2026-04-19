import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import { swaggerUI } from "@hono/swagger-ui";
import { env } from "../config/env.js";
import { connectRabbitMQ, disconnectRabbitMQ } from "../rabbitmq/client.js";
import { producerRoutes } from "./routes.js";
import { getOpenAPISpec } from "./openapi.js";
import { apiKeyAuth } from "../middleware/api-key.js";
import { httpRateLimit } from "../middleware/http-rate-limit.js";
import { logger } from "../lib/logger.js";

const app = new Hono();

// Middleware
app.use("*", cors());
app.use("*", apiKeyAuth);
app.use("*", httpRateLimit);

// Health check (excluded from auth/rate-limit via middleware)
app.get("/health", (c) =>
  c.json({
    status: "ok",
    service: "notification-publisher",
    timestamp: new Date().toISOString(),
  })
);

// OpenAPI spec + Swagger UI (public, no auth)
app.get("/openapi.json", (c) => c.json(getOpenAPISpec()));
app.get("/docs", swaggerUI({ url: "/openapi.json" }));

// API routes
app.route("/api/v1", producerRoutes);

// Startup
let server: ReturnType<typeof serve>;

async function start() {
  await connectRabbitMQ();

  server = serve({ fetch: app.fetch, port: env.PORT }, (info) => {
    logger.info({ port: info.port }, "Publisher API running");
  });
}

// Graceful shutdown — drain connections before exiting
let isShuttingDown = false;
const shutdown = async (signal: string) => {
  if (isShuttingDown) return;
  isShuttingDown = true;

  logger.info({ signal }, "Shutting down publisher...");

  // Stop accepting new connections
  server?.close?.();

  // Disconnect message broker
  try {
    await disconnectRabbitMQ();
  } catch (err) {
    logger.error({ error: err }, "Error disconnecting RabbitMQ");
  }

  logger.info("Publisher shut down cleanly");
  process.exit(0);
};
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

start().catch((err) => {
  logger.fatal({ error: err }, "Failed to start publisher");
  process.exit(1);
});
