import { zValidator } from "@hono/zod-validator";
import { authMiddleware } from "../middleware/auth";
import { prisma } from "../lib/prisma";
import { CreateProductSchema, UpdateProductSchema } from "../schemas";
import { createApp } from "../lib/hono";

const products = createApp();

// Get all products
products.get("/", authMiddleware, async (c) => {
  const userId = c.get("userId");
  
  const allProducts = await prisma.product.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });
  
  return c.json(allProducts);
});

// Get a single product
products.get("/:id", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");
  
  const product = await prisma.product.findFirst({
    where: { id, userId }
  });
  
  if (!product) {
    return c.json({ error: "Product not found" }, 404);
  }
  
  return c.json(product);
});

// Create a new product
products.post("/", authMiddleware, zValidator("json", CreateProductSchema), async (c) => {
  const userId = c.get("userId");
  const data = c.req.valid("json");
  
  const product = await prisma.product.create({
    data: {
      ...data,
      userId
    }
  });
  
  return c.json(product, 201);
});

// Update a product
products.patch("/:id", authMiddleware, zValidator("json", UpdateProductSchema), async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");
  const data = c.req.valid("json");
  
  const existing = await prisma.product.findFirst({
    where: { id, userId }
  });
  
  if (!existing) {
    return c.json({ error: "Product not found" }, 404);
  }
  
  const product = await prisma.product.update({
    where: { id },
    data
  });
  
  return c.json(product);
});

// Delete a product
products.delete("/:id", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");
  
  const existing = await prisma.product.findFirst({
    where: { id, userId }
  });
  
  if (!existing) {
    return c.json({ error: "Product not found" }, 404);
  }
  
  await prisma.product.delete({
    where: { id }
  });
  
  return c.json({ message: "Product deleted successfully" });
});

export default products;
