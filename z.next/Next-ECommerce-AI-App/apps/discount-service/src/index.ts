import Fastify from "fastify";
import mongoose from "mongoose";
import { discountRoute } from "./routes/discount.route.js";
import fastifyCors from "@fastify/cors";

const fastify = Fastify({
  logger: true,
});

const PORT = process.env.PORT || 3004;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/discount-service";

// Register CORS plugin, defaults to allow all origins
fastify.register(fastifyCors);

fastify.get("/", async (request, reply) => {
  return { status: "ok", service: "discount-service" };
});

// Register routes
fastify.register(discountRoute, { prefix: "/api/discount" });

const start = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    await fastify.listen({ port: Number(PORT), host: "0.0.0.0" });
    console.log(`Discount Service running on port ${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
