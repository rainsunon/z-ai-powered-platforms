import { zValidator } from "@hono/zod-validator";
import { authMiddleware } from "../middleware/auth";
import { prisma } from "../lib/prisma";
import { CreateEstimateSchema, UpdateEstimateSchema } from "../schemas";
import { createApp } from "../lib/hono";

const estimates = createApp();

// Get all estimates
estimates.get("/", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const status = c.req.query("status");
  
  const where: any = { userId };
  if (status) where.status = status;
  
  const allEstimates = await prisma.estimate.findMany({
    where,
    include: {
      customer: true
    },
    orderBy: { date: "desc" }
  });
  
  return c.json(allEstimates);
});

// Get a single estimate
estimates.get("/:id", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");
  
  const estimate = await prisma.estimate.findFirst({
    where: { id, userId },
    include: {
      customer: true
    }
  });
  
  if (!estimate) {
    return c.json({ error: "Estimate not found" }, 404);
  }
  
  return c.json(estimate);
});

// Create a new estimate
estimates.post("/", authMiddleware, zValidator("json", CreateEstimateSchema), async (c) => {
  const userId = c.get("userId");
  const data = c.req.valid("json");
  
  // Generate estimate number if not provided
  if (!data.estimateNumber) {
    const count = await prisma.estimate.count({ where: { userId } });
    const year = new Date().getFullYear();
    data.estimateNumber = `EST-${year}-${String(count + 1).padStart(4, '0')}`;
  }
  
  const estimate = await prisma.estimate.create({
    data: {
      ...data,
      userId,
      date: new Date(data.date),
      expiryDate: data.expiryDate ? new Date(data.expiryDate) : null
    },
    include: {
      customer: true
    }
  });
  
  return c.json(estimate, 201);
});

// Update an estimate
estimates.patch("/:id", authMiddleware, zValidator("json", UpdateEstimateSchema), async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");
  const data = c.req.valid("json");
  
  const existing = await prisma.estimate.findFirst({
    where: { id, userId }
  });
  
  if (!existing) {
    return c.json({ error: "Estimate not found" }, 404);
  }
  
  const updateData: any = { ...data };
  if (data.date) updateData.date = new Date(data.date);
  if (data.expiryDate) updateData.expiryDate = new Date(data.expiryDate);
  
  const estimate = await prisma.estimate.update({
    where: { id },
    data: updateData,
    include: {
      customer: true
    }
  });
  
  return c.json(estimate);
});

// Delete an estimate
estimates.delete("/:id", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");
  
  const existing = await prisma.estimate.findFirst({
    where: { id, userId }
  });
  
  if (!existing) {
    return c.json({ error: "Estimate not found" }, 404);
  }
  
  await prisma.estimate.delete({
    where: { id }
  });
  
  return c.json({ message: "Estimate deleted successfully" });
});

export default estimates;
