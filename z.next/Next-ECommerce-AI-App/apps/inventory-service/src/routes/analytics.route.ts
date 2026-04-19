import { FastifyInstance } from "fastify";
import { Inventory } from "../models/Inventory.js";
import { startOfMonth, subMonths } from "date-fns";

export const analyticsRoute = async (fastify: FastifyInstance) => {
  // GET /sales-summary - Overall sales metrics
  fastify.get("/sales-summary", async (request, reply) => {
    try {
      const allInventory = await Inventory.find();
      
      const totalRevenue = allInventory.reduce((sum, item) => {
        return sum + item.salesHistory.reduce((s, sale) => s + sale.revenue, 0);
      }, 0);

      const totalOrders = allInventory.reduce((sum, item) => {
        return sum + item.salesHistory.length;
      }, 0);

      const totalProductsSold = allInventory.reduce((sum, item) => {
        return sum + item.soldCount;
      }, 0);

      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      return reply.send({
        totalRevenue,
        totalOrders,
        totalProductsSold,
        averageOrderValue,
        totalInventoryValue: allInventory.reduce((sum, item) => 
          sum + (item.currentStock * item.productPrice), 0
        )
      });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: "Failed to fetch sales summary" });
    }
  });

  // GET /top-products - Best selling products
  fastify.get("/top-products", async (request, reply) => {
    const { limit = 10 } = request.query as { limit?: number };

    try {
      const topProducts = await Inventory.find()
        .sort({ soldCount: -1 })
        .limit(Number(limit));

      const result = topProducts.map(item => ({
        productId: item.productId,
        productName: item.productName,
        unitsSold: item.soldCount,
        revenue: item.salesHistory.reduce((sum, sale) => sum + sale.revenue, 0),
        currentStock: item.currentStock,
        averagePrice: item.productPrice
      }));

      return reply.send(result);
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: "Failed to fetch top products" });
    }
  });

  // GET /revenue-chart - Revenue over time (last 6 months)
  fastify.get("/revenue-chart", async (request, reply) => {
    try {
      const now = new Date();
      const sixMonthsAgo = startOfMonth(subMonths(now, 5));

      const allInventory = await Inventory.find();
      
      // Aggregate sales by month
      const monthlyRevenue: Record<string, number> = {};
      
      allInventory.forEach(item => {
        item.salesHistory.forEach(sale => {
          if (sale.date >= sixMonthsAgo) {
            const monthKey = `${sale.date.getFullYear()}-${String(sale.date.getMonth() + 1).padStart(2, '0')}`;
            monthlyRevenue[monthKey] = (monthlyRevenue[monthKey] || 0) + sale.revenue;
          }
        });
      });

      // Format for chart
      const monthNames = ["January", "February", "March", "April", "May", "June", 
                         "July", "August", "September", "October", "November", "December"];
      
      const result = [];
      for (let i = 5; i >= 0; i--) {
        const d = subMonths(now, i);
        const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        result.push({
          month: monthNames[d.getMonth()],
          revenue: monthlyRevenue[monthKey] || 0
        });
      }

      return reply.send(result);
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: "Failed to fetch revenue chart" });
    }
  });

  // GET /inventory-value - Total inventory value
  fastify.get("/inventory-value", async (request, reply) => {
    try {
      const allInventory = await Inventory.find();
      
      const totalValue = allInventory.reduce((sum, item) => {
        return sum + (item.currentStock * item.productPrice);
      }, 0);

      const breakdown = allInventory.map(item => ({
        productId: item.productId,
        productName: item.productName,
        stock: item.currentStock,
        pricePerUnit: item.productPrice,
        totalValue: item.currentStock * item.productPrice
      })).sort((a, b) => b.totalValue - a.totalValue);

      return reply.send({
        totalValue,
        breakdown
      });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: "Failed to fetch inventory value" });
    }
  });

  // GET /product-performance/:productId - Individual product analytics
  fastify.get("/product-performance/:productId", async (request, reply) => {
    const { productId } = request.params as { productId: string };

    try {
      const inventory = await Inventory.findOne({ productId });
      
      if (!inventory) {
        return reply.status(404).send({ error: "Product not found" });
      }

      const totalRevenue = inventory.salesHistory.reduce((sum, sale) => sum + sale.revenue, 0);
      const averageSalePrice = inventory.soldCount > 0 ? totalRevenue / inventory.soldCount : 0;

      // Sales trend (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentSales = inventory.salesHistory.filter(sale => sale.date >= thirtyDaysAgo);

      return reply.send({
        productId: inventory.productId,
        productName: inventory.productName,
        currentStock: inventory.currentStock,
        soldCount: inventory.soldCount,
        totalRevenue,
        averageSalePrice,
        recentSales: recentSales.length,
        lastSale: inventory.salesHistory.length > 0 
          ? inventory.salesHistory[inventory.salesHistory.length - 1]!.date 
          : null,
        restockCount: inventory.restockHistory.length,
        lastRestock: inventory.lastRestocked
      });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: "Failed to fetch product performance" });
    }
  });
};
