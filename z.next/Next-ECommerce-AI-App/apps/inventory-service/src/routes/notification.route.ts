import { FastifyInstance } from "fastify";
import { Inventory } from "../models/Inventory.js";
import { producer } from "../utils/kafka.js";

export const notificationRoute = async (fastify: FastifyInstance) => {
  // POST /check-low-stock - Check and send low stock notifications
  fastify.post("/check-low-stock", async (request, reply) => {
    try {
      const lowStockItems = await Inventory.find({
        $expr: { $lte: ["$currentStock", "$reorderLevel"] }
      });

      if (lowStockItems.length > 0) {
        // Publish low stock alert event to Kafka
        for (const item of lowStockItems) {
          await producer.send("inventory.low-stock", {
            value: {
              productId: item.productId,
              productName: item.productName,
              currentStock: item.currentStock,
              reorderLevel: item.reorderLevel,
              timestamp: new Date().toISOString(),
            },
          });
        }

        return reply.send({
          message: `Low stock alerts sent for ${lowStockItems.length} products`,
          count: lowStockItems.length,
          products: lowStockItems.map(item => ({
            productId: item.productId,
            productName: item.productName,
            currentStock: item.currentStock,
          })),
        });
      }

      return reply.send({
        message: "No low stock items found",
        count: 0,
      });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: "Failed to check low stock" });
    }
  });

  // POST /webhook - Webhook endpoint for external integrations
  fastify.post("/webhook", async (request, reply) => {
    const body = request.body as {
      url: string;
      event: string;
      productId?: string;
    };

    try {
      // This is a placeholder for webhook functionality
      // In production, you would:
      // 1. Validate the webhook URL
      // 2. Store webhook subscriptions in database
      // 3. Trigger webhooks when events occur

      return reply.send({
        message: "Webhook registered successfully",
        url: body.url,
        event: body.event,
      });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: "Failed to register webhook" });
    }
  });
};
