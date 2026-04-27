import { zValidator } from "@hono/zod-validator";
import { authMiddleware } from "../middleware/auth";
import { prisma } from "../lib/prisma";
import { CreateTransactionSchema, UpdateTransactionSchema } from "../schemas";
import { createApp } from "../lib/hono";

const transactions = createApp();

// Get all transactions
transactions.get("/", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const type = c.req.query("type");
  const category = c.req.query("category");
  
  const where: any = { userId };
  if (type) where.type = type;
  if (category) where.category = category;
  
  const allTransactions = await prisma.transaction.findMany({
    where,
    orderBy: { date: "desc" }
  });
  
  return c.json(allTransactions);
});

// Get a single transaction
transactions.get("/:id", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");
  
  const transaction = await prisma.transaction.findFirst({
    where: { id, userId }
  });
  
  if (!transaction) {
    return c.json({ error: "Transaction not found" }, 404);
  }
  
  return c.json(transaction);
});

// Create a new transaction
transactions.post("/", authMiddleware, zValidator("json", CreateTransactionSchema), async (c) => {
  const userId = c.get("userId");
  const data = c.req.valid("json");
  
  const transaction = await prisma.transaction.create({
    data: {
      ...data,
      userId,
      date: new Date(data.date)
    }
  });
  
  return c.json(transaction, 201);
});

// Update a transaction
transactions.patch("/:id", authMiddleware, zValidator("json", UpdateTransactionSchema), async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");
  const data = c.req.valid("json");
  
  const existing = await prisma.transaction.findFirst({
    where: { id, userId }
  });
  
  if (!existing) {
    return c.json({ error: "Transaction not found" }, 404);
  }
  
  const updateData: any = { ...data };
  if (data.date) updateData.date = new Date(data.date);
  
  const transaction = await prisma.transaction.update({
    where: { id },
    data: updateData
  });
  
  return c.json(transaction);
});

// Delete a transaction
transactions.delete("/:id", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");
  
  const existing = await prisma.transaction.findFirst({
    where: { id, userId }
  });
  
  if (!existing) {
    return c.json({ error: "Transaction not found" }, 404);
  }
  
  await prisma.transaction.delete({
    where: { id }
  });
  
  return c.json({ message: "Transaction deleted successfully" });
});

export default transactions;
