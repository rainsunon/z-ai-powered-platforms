import { FastifyInstance } from "fastify";
import { Inventory } from "../models/Inventory.js";
import { publishAuditEvent } from "../utils/audit.js";

export const inventoryRoute = async (fastify: FastifyInstance) => {
  // GET /list - List all inventory items
  fastify.get("/list", async (request, reply) => {
    try {
      const inventory = await Inventory.find().sort({ productName: 1 });
      return reply.send(inventory);
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: "Failed to fetch inventory" });
    }
  });

  // GET /:productId - Get specific product inventory
  fastify.get("/:productId", async (request, reply) => {
    const { productId } = request.params as { productId: string };

    try {
      const inventory = await Inventory.findOne({ productId });
      
      if (!inventory) {
        return reply.status(404).send({ error: "Product not found in inventory" });
      }

      return reply.send(inventory);
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: "Failed to fetch inventory" });
    }
  });

  // POST /create - Create inventory record (Admin)
  fastify.post("/create", async (request, reply) => {
    const body = request.body as {
      productId: string;
      productName: string;
      productPrice: number;
      initialStock?: number;
      reorderLevel?: number;
    };

    try {
      const existingInventory = await Inventory.findOne({ productId: body.productId });
      
      if (existingInventory) {
        return reply.status(400).send({ error: "Inventory record already exists" });
      }

      const inventory = new Inventory({
        productId: body.productId,
        productName: body.productName,
        productPrice: body.productPrice,
        currentStock: body.initialStock || 0,
        reorderLevel: body.reorderLevel || 10,
        restockHistory: body.initialStock ? [{
          date: new Date(),
          quantity: body.initialStock,
          note: "Initial stock"
        }] : [],
        salesHistory: []
      });

      await inventory.save();
      return reply.status(201).send(inventory);
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: "Failed to create inventory" });
    }
  });

  // PATCH /:productId/restock - Add stock (Admin)
  fastify.patch("/:productId/restock", async (request, reply) => {
    const { productId } = request.params as { productId: string };
    const body = request.body as { quantity: number; note?: string };

    try {
      const inventory = await Inventory.findOne({ productId });
      
      if (!inventory) {
        return reply.status(404).send({ error: "Product not found in inventory" });
      }

      const oldStock = inventory.currentStock;
      inventory.currentStock += body.quantity;
      inventory.lastRestocked = new Date();
      inventory.restockHistory.push({
        date: new Date(),
        quantity: body.quantity,
        note: body.note || ""
      });

      await inventory.save();

      // Publish audit event
      await publishAuditEvent(
        "audit.inventory",
        {
          eventType: "inventory.restocked",
          eventCategory: "inventory",
          action: "update",
          resourceType: "inventory",
          resourceId: productId,
          resourceName: inventory.productName,
          changes: {
            before: { currentStock: oldStock },
            after: { currentStock: inventory.currentStock },
          },
          metadata: {
            quantity: body.quantity,
            note: body.note,
          },
        },
        "inventory-service"
      );

      return reply.send(inventory);
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: "Failed to restock" });
    }
  });

  // PATCH /:productId/adjust - Adjust stock levels (Admin)
  fastify.patch("/:productId/adjust", async (request, reply) => {
    const { productId } = request.params as { productId: string };
    const body = request.body as { newStock: number; note?: string };

    try {
      const inventory = await Inventory.findOne({ productId });
      
      if (!inventory) {
        return reply.status(404).send({ error: "Product not found in inventory" });
      }

      const difference = body.newStock - inventory.currentStock;
      inventory.currentStock = body.newStock;
      
      if (difference !== 0) {
        inventory.restockHistory.push({
          date: new Date(),
          quantity: difference,
          note: body.note || "Stock adjustment"
        });
      }

      await inventory.save();
      return reply.send(inventory);
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: "Failed to adjust stock" });
    }
  });

  // GET /low-stock - Get products below reorder level
  fastify.get("/low-stock", async (request, reply) => {
    try {
      const lowStockItems = await Inventory.find({
        $expr: { $lte: ["$currentStock", "$reorderLevel"] }
      }).sort({ currentStock: 1 });

      return reply.send(lowStockItems);
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: "Failed to fetch low stock items" });
    }
  });

  // GET /export-csv - Export inventory as CSV
  fastify.get("/export-csv", async (request, reply) => {
    try {
      const inventory = await Inventory.find().sort({ productName: 1 });
      
      // Create CSV header
      const headers = [
        "Product ID",
        "Product Name",
        "Price",
        "Current Stock",
        "Sold Count",
        "Reorder Level",
        "Stock Value",
        "Last Restocked"
      ];

      // Create CSV rows
      const rows = inventory.map(item => [
        item.productId,
        `"${item.productName}"`, // Quote to handle commas in names
        item.productPrice.toFixed(2),
        item.currentStock,
        item.soldCount,
        item.reorderLevel,
        (item.currentStock * item.productPrice).toFixed(2),
        item.lastRestocked ? item.lastRestocked.toISOString() : "Never"
      ]);

      // Combine header and rows
      const csv = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");

      reply.header("Content-Type", "text/csv");
      reply.header("Content-Disposition", `attachment; filename="inventory-export-${new Date().toISOString().split('T')[0]}.csv"`);
      return reply.send(csv);
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: "Failed to export inventory" });
    }
  });
};
