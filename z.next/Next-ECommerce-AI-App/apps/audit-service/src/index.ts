import Fastify from "fastify";
import mongoose from "mongoose";
import { auditRoute } from "./routes/audit.route.js";
import { runKafkaSubscriptions } from "./utils/subscriptions.js";

const fastify = Fastify({
  logger: true,
});

const PORT = process.env.PORT || 3006;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/audit-service";

fastify.get("/", async (request, reply) => {
  return { status: "ok", service: "audit-service" };
});

fastify.get("/health", async (request, reply) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  return {
    status: "ok",
    service: "audit-service",
    database: dbStatus,
    timestamp: new Date().toISOString(),
  };
});

// Register routes
fastify.register(auditRoute, { prefix: "/api/audit" });

const start = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Start Kafka subscriptions
    await runKafkaSubscriptions();

    // Start server
    await fastify.listen({ port: PORT as number, host: "0.0.0.0" });
    console.log(`Audit service listening on port ${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
