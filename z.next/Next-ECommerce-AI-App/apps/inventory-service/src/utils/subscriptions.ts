import { consumer } from "./kafka.js";
import { Inventory } from "../models/Inventory.js";

export const runKafkaSubscriptions = async () => {
  consumer.subscribe([
    {
      topicName: "order.created",
      topicHandler: async (message) => {
        const order = message.value;
        
        try {
          // Update inventory for each product in the order
          if (order.products && Array.isArray(order.products)) {
            for (const product of order.products) {
              const inventory = await Inventory.findOne({ productId: product.id || product.productId });
              
              if (inventory) {
                const quantity = product.quantity || 1;
                const revenue = (product.price || 0) * quantity;
                
                // Decrement stock
                inventory.currentStock = Math.max(0, inventory.currentStock - quantity);
                inventory.soldCount += quantity;
                
                // Add to sales history
                inventory.salesHistory.push({
                  date: new Date(),
                  quantity,
                  orderId: order._id || order.id || "unknown",
                  revenue
                });
                
                await inventory.save();
                console.log(`Updated inventory for product ${product.id || product.productId}: -${quantity} units`);
              } else {
                console.warn(`Product ${product.id || product.productId} not found in inventory`);
              }
            }
          }
        } catch (error) {
          console.error("Error processing order.created event:", error);
        }
      },
    },
    {
      topicName: "product.created",
      topicHandler: async (message) => {
        const product = message.value;
        
        try {
          // Check if inventory record already exists
          const existingInventory = await Inventory.findOne({ productId: product.id });
          
          if (!existingInventory) {
            const inventory = new Inventory({
              productId: product.id,
              productName: product.name,
              productPrice: product.price || 0,
              currentStock: 0,
              reorderLevel: 10,
              restockHistory: [],
              salesHistory: []
            });
            
            await inventory.save();
            console.log(`Created inventory record for product ${product.id}`);
          }
        } catch (error) {
          console.error("Error processing product.created event:", error);
        }
      },
    },
    {
      topicName: "product.updated",
      topicHandler: async (message) => {
        const product = message.value;
        
        try {
          const inventory = await Inventory.findOne({ productId: product.id });
          
          if (inventory) {
            // Update denormalized fields
            if (product.name) inventory.productName = product.name;
            if (product.price !== undefined) inventory.productPrice = product.price;
            
            await inventory.save();
            console.log(`Updated inventory record for product ${product.id}`);
          }
        } catch (error) {
          console.error("Error processing product.updated event:", error);
        }
      },
    },
  ]);
};
