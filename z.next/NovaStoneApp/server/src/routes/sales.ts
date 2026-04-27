import { zValidator } from "@hono/zod-validator";
import { authMiddleware } from "../middleware/auth";
import { prisma } from "../lib/prisma";
import { CreateSaleSchema, UpdateSaleSchema } from "../schemas";
import { createApp } from "../lib/hono";

const sales = createApp();

sales.get("/", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const search = c.req.query("search") || "";
  const status = c.req.query("status");
  const category = c.req.query("category");
  const page = Number(c.req.query("page")) || 1;
  const limit = Number(c.req.query("limit")) || 50;
  const skip = (page - 1) * limit;

  const where: any = { userId };
  if (status) where.status = status;
  if (category) where.category = category;
  if (search) {
    where.OR = [
      { reference: { contains: search, mode: "insensitive" } },
      { customer: { name: { contains: search, mode: "insensitive" } } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.sale.findMany({
      where,
      include: { customer: true },
      orderBy: { date: "desc" },
      skip,
      take: limit,
    }),
    prisma.sale.count({ where }),
  ]);

  const totals = {
    total: await prisma.sale.aggregate({ where: { userId }, _sum: { amount: true } }),
    unpaid: await prisma.sale.aggregate({ where: { userId, status: "unpaid" }, _sum: { amount: true } }),
    overdue: await prisma.sale.aggregate({ where: { userId, status: "overdue" }, _sum: { amount: true } }),
  };

  return c.json({
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    totals: {
      total: totals.total._sum.amount || 0,
      unpaid: totals.unpaid._sum.amount || 0,
      overdue: totals.overdue._sum.amount || 0,
    },
  });
});

sales.get("/categories", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const result = await prisma.sale.findMany({
    where: { userId },
    distinct: ["category"],
    select: { category: true },
  });
  return c.json(result.map(r => r.category));
});

sales.get("/stats", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const [total, unpaid, overdue, paid] = await Promise.all([
    prisma.sale.aggregate({ where: { userId }, _sum: { amount: true } }),
    prisma.sale.aggregate({ where: { userId, status: "unpaid" }, _sum: { amount: true }, _count: true }),
    prisma.sale.aggregate({ where: { userId, status: "overdue" }, _sum: { amount: true }, _count: true }),
    prisma.sale.aggregate({ where: { userId, status: "paid" }, _sum: { amount: true }, _count: true }),
  ]);

  return c.json({
    total: { amount: total._sum.amount || 0, count: total._count || 0 },
    unpaid: { amount: unpaid._sum.amount || 0, count: unpaid._count || 0 },
    overdue: { amount: overdue._sum.amount || 0, count: overdue._count || 0 },
    paid: { amount: paid._sum.amount || 0, count: paid._count || 0 },
  });
});

sales.get("/:id", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");

  const sale = await prisma.sale.findFirst({
    where: { id, userId },
    include: { customer: true },
  });

  if (!sale) {
    return c.json({ error: "Sale not found" }, 404);
  }

  return c.json(sale);
});

sales.post("/", authMiddleware, zValidator("json", CreateSaleSchema), async (c) => {
  const userId = c.get("userId");
  const data = c.req.valid("json") as any;

  if (!data.reference) {
    const count = await prisma.sale.count({ where: { userId } });
    data.reference = `SLE-${String(count + 1).padStart(3, '0')}`;
  }

  const sale = await prisma.sale.create({
    data: {
      customerId: data.customerId,
      reference: data.reference,
      category: data.category,
      status: data.status || "unpaid",
      amount: data.amount,
      currency: data.currency || "USD",
      date: new Date(data.date),
      dueDate: new Date(data.dueDate),
      lineItems: data.lineItems || [],
      paymentTerms: data.paymentTerms ? { terms: data.paymentTerms } : null,
      customerInfo: {
        address: data.customerAddress,
        phone: data.customerPhone,
        email: data.customerEmail,
      },
      reminders: data.reminderSchedule ? { schedule: data.reminderSchedule, message: data.customReminderMessage } : null,
      userId,
    },
    include: { customer: true },
  });

  return c.json(sale, 201);
});

sales.patch("/:id", authMiddleware, zValidator("json", UpdateSaleSchema), async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");
  const data = c.req.valid("json") as any;

  const existing = await prisma.sale.findFirst({ where: { id, userId } });
  if (!existing) {
    return c.json({ error: "Sale not found" }, 404);
  }

  const updateData: any = { ...data };
  if (data.date) updateData.date = new Date(data.date);
  if (data.dueDate) updateData.dueDate = new Date(data.dueDate);
  if (data.lineItems) updateData.lineItems = data.lineItems;
  if (data.customerId) updateData.customerId = data.customerId;

  const sale = await prisma.sale.update({
    where: { id },
    data: updateData,
    include: { customer: true },
  });

  return c.json(sale);
});

sales.delete("/:id", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");

  const existing = await prisma.sale.findFirst({ where: { id, userId } });
  if (!existing) {
    return c.json({ error: "Sale not found" }, 404);
  }

  await prisma.sale.delete({ where: { id } });
  return c.json({ message: "Sale deleted successfully" });
});

sales.post("/:id/pay", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");

  const existing = await prisma.sale.findFirst({ where: { id, userId } });
  if (!existing) {
    return c.json({ error: "Sale not found" }, 404);
  }

  const sale = await prisma.sale.update({
    where: { id },
    data: { status: "paid" },
    include: { customer: true },
  });

  return c.json(sale);
});

sales.post("/bulk/mark-paid", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const { ids } = await c.req.json<{ ids: string[] }>();

  const result = await prisma.sale.updateMany({
    where: { id: { in: ids }, userId },
    data: { status: "paid" },
  });

  return c.json({ updated: result.count });
});

sales.post("/bulk/delete", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const { ids } = await c.req.json<{ ids: string[] }>();

  const result = await prisma.sale.deleteMany({
    where: { id: { in: ids }, userId },
  });

  return c.json({ deleted: result.count });
});

export default sales;
