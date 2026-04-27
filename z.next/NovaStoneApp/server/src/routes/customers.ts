import { zValidator } from "@hono/zod-validator";
import { authMiddleware } from "../middleware/auth";
import { prisma } from "../lib/prisma";
import { CreateCustomerSchema, UpdateCustomerSchema } from "../schemas";
import { createApp } from "../lib/hono";

const customers = createApp();

customers.get("/", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const search = c.req.query("search") || "";
  const page = Number(c.req.query("page")) || 1;
  const limit = Number(c.req.query("limit")) || 50;
  const skip = (page - 1) * limit;

  const where: any = { userId };
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.customer.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: limit }),
    prisma.customer.count({ where }),
  ]);

  return c.json({ items, total, page, limit, totalPages: Math.ceil(total / limit) });
});

customers.get("/:id", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");

  const customer = await prisma.customer.findFirst({
    where: { id, userId },
    include: {
      invoices: { orderBy: { date: "desc" }, take: 10 },
      sales: { orderBy: { date: "desc" }, take: 10 },
      estimates: { orderBy: { date: "desc" }, take: 10 },
    },
  });

  if (!customer) {
    return c.json({ error: "Customer not found" }, 404);
  }

  return c.json(customer);
});

customers.post("/", authMiddleware, zValidator("json", CreateCustomerSchema), async (c) => {
  const userId = c.get("userId");
  const data = c.req.valid("json");

  const customer = await prisma.customer.create({
    data: { ...data, userId, balance: 0, overdue: 0 },
  });

  return c.json(customer, 201);
});

customers.patch("/:id", authMiddleware, zValidator("json", UpdateCustomerSchema), async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");
  const data = c.req.valid("json");

  const existing = await prisma.customer.findFirst({ where: { id, userId } });
  if (!existing) {
    return c.json({ error: "Customer not found" }, 404);
  }

  const customer = await prisma.customer.update({ where: { id }, data });
  return c.json(customer);
});

customers.delete("/:id", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");

  const existing = await prisma.customer.findFirst({ where: { id, userId } });
  if (!existing) {
    return c.json({ error: "Customer not found" }, 404);
  }

  await prisma.customer.delete({ where: { id } });
  return c.json({ message: "Customer deleted successfully" });
});

customers.delete("/bulk/delete", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const { ids } = await c.req.json<{ ids: string[] }>();

  const result = await prisma.customer.deleteMany({
    where: { id: { in: ids }, userId },
  });

  return c.json({ deleted: result.count });
});

export default customers;
