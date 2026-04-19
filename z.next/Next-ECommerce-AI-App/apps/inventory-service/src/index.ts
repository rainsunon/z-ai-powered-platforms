import Fastify from "fastify";
import mongoose from "mongoose";
import { inventoryRoute } from "./routes/inventory.route.js";
import { analyticsRoute } from "./routes/analytics.route.js";
import { notificationRoute } from "./routes/notification.route.js";
import { runKafkaSubscriptions } from "./utils/subscriptions.js";

const fastify = Fastify({
  logger: true,
});

const PORT = process.env.PORT || 3005;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/inventory-service";

fastify.get("/", async (request, reply) => {
  return { status: "ok", service: "inventory-service" };
});

// Register routes
fastify.register(inventoryRoute, { prefix: "/api/inventory" });
fastify.register(analyticsRoute, { prefix: "/api/analytics" });
fastify.register(notificationRoute, { prefix: "/api/notifications" });

const start = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
    
    // Start Kafka subscriptions
    await runKafkaSubscriptions();
    console.log("Kafka subscriptions active");
    
    await fastify.listen({ port: Number(PORT), host: "0.0.0.0" });
    console.log(`Inventory Service running on port ${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
