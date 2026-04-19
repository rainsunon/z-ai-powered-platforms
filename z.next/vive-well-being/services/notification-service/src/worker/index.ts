import http from "node:http";
import { connectRabbitMQ, disconnectRabbitMQ, QUEUE, getChannel } from "../rabbitmq/client.js";
import { disconnectRedis } from "./rate-limiter.js";
import { processMessage } from "./consumer.js";
import { env } from "../config/env.js";
import { logger } from "../lib/logger.js";

let isConsuming = false;
let consumerTag: string | undefined;

async function start() {
  await connectRabbitMQ();
  const channel = getChannel();

  // Prefetch 10 — allow concurrent processing while keeping backpressure
  await channel.prefetch(10);

  const { consumerTag: tag } = await channel.consume(QUEUE, async (msg) => {
    if (!msg) return;
    await processMessage(msg);
  });
  consumerTag = tag;
  isConsuming = true;

  logger.info({ queue: QUEUE, prefetch: 10 }, "Worker consuming");

  // --- Worker health check server ---
  const healthServer = http.createServer((_req, res) => {
    const healthy = isConsuming;
    res.writeHead(healthy ? 200 : 503, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        status: healthy ? "ok" : "unhealthy",
        service: "notification-worker",
        consuming: isConsuming,
        timestamp: new Date().toISOString(),
      })
    );
  });

  healthServer.listen(env.WORKER_HEALTH_PORT, () => {
    logger.info({ port: env.WORKER_HEALTH_PORT }, "Worker health endpoint running");
  });
}

// Graceful shutdown — cancel consumer, wait for in-flight, then disconnect
let isShuttingDown = false;
const shutdown = async (signal: string) => {
  if (isShuttingDown) return;
  isShuttingDown = true;
  isConsuming = false;

  logger.info({ signal }, "Shutting down worker...");

  // Stop consuming new messages
  const channel = getChannel();
  if (consumerTag) {
    try {
      await channel.cancel(consumerTag);
      logger.info("Consumer cancelled, waiting for in-flight messages...");
    } catch {
      // Channel may already be closed
    }
  }

  // Allow in-flight messages to finish (give them up to 10s)
  await new Promise((resolve) => setTimeout(resolve, 5000));

  try {
    await disconnectRedis();
  } catch (err) {
    logger.error({ error: err }, "Error disconnecting Redis");
  }
  try {
    await disconnectRabbitMQ();
  } catch (err) {
    logger.error({ error: err }, "Error disconnecting RabbitMQ");
  }

  logger.info("Worker shut down cleanly");
  process.exit(0);
};
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

start().catch((err) => {
  logger.fatal({ error: err }, "Failed to start worker");
  process.exit(1);
});
