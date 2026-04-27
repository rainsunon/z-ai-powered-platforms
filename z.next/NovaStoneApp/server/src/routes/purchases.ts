import { zValidator } from "@hono/zod-validator";
import { authMiddleware } from "../middleware/auth";
import { prisma } from "../lib/prisma";
import { CreatePurchaseSchema, UpdatePurchaseSchema } from "../schemas";
import { createApp } from "../lib/hono";

const purchases = createApp();

purchases.get("/", authMiddleware, async (c) => {
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
      { vendor: { contains: search, mode: "insensitive" } },
      { reference: { contains: search, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.purchase.findMany({ where, orderBy: { date: "desc" }, skip, take: limit }),
    prisma.purchase.count({ where }),
  ]);

  const totals = {
    total: await prisma.purchase.aggregate({ where: { userId }, _sum: { amount: true } }),
    unpaid: await prisma.purchase.aggregate({ where: { userId, status: "unpaid" }, _sum: { amount: true } }),
    overdue: await prisma.purchase.aggregate({ where: { userId, status: "overdue" }, _sum: { amount: true } }),
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

purchases.get("/categories", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const result = await prisma.purchase.findMany({
    where: { userId },
    distinct: ["category"],
    select: { category: true },
  });
  return c.json(result.map(r => r.category));
});

purchases.get("/stats", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const [total, unpaid, overdue, paid] = await Promise.all([
    prisma.purchase.aggregate({ where: { userId }, _sum: { amount: true } }),
    prisma.purchase.aggregate({ where: { userId, status: "unpaid" }, _sum: { amount: true }, _count: true }),
    prisma.purchase.aggregate({ where: { userId, status: "overdue" }, _sum: { amount: true }, _count: true }),
    prisma.purchase.aggregate({ where: { userId, status: "paid" }, _sum: { amount: true }, _count: true }),
  ]);

  return c.json({
    total: { amount: total._sum.amount || 0, count: total._count || 0 },
    unpaid: { amount: unpaid._sum.amount || 0, count: unpaid._count || 0 },
    overdue: { amount: overdue._sum.amount || 0, count: overdue._count || 0 },
    paid: { amount: paid._sum.amount || 0, count: paid._count || 0 },
  });
});

purchases.get("/:id", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");

  const purchase = await prisma.purchase.findFirst({ where: { id, userId } });
  if (!purchase) {
    return c.json({ error: "Purchase not found" }, 404);
  }

  const relatedPurchases = await prisma.purchase.findMany({
    where: { userId, vendor: purchase.vendor, id: { not: id } },
    orderBy: { date: "desc" },
    take: 5,
  });

  return c.json({ ...purchase, relatedPurchases });
});

purchases.post("/", authMiddleware, zValidator("json", CreatePurchaseSchema), async (c) => {
  const userId = c.get("userId");
  const data = c.req.valid("json") as any;

  if (!data.reference) {
    const count = await prisma.purchase.count({ where: { userId } });
    data.reference = `PUR-${String(count + 1).padStart(3, '0')}`;
  }

  const purchase = await prisma.purchase.create({
    data: {
      vendor: data.vendor,
      reference: data.reference,
      category: data.category,
      status: data.status || "unpaid",
      amount: data.amount,
      currency: data.currency || "USD",
      date: new Date(data.date),
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      lineItems: data.lineItems || [],
      vendorInfo: {
        address: data.vendorAddress,
        phone: data.vendorPhone,
        email: data.vendorEmail,
      },
      paymentInfo: {
        terms: data.paymentTerms,
      },
      userId,
    },
  });

  return c.json(purchase, 201);
});

purchases.patch("/:id", authMiddleware, zValidator("json", UpdatePurchaseSchema), async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");
  const data = c.req.valid("json") as any;

  const existing = await prisma.purchase.findFirst({ where: { id, userId } });
  if (!existing) {
    return c.json({ error: "Purchase not found" }, 404);
  }

  const updateData: any = { ...data };
  if (data.date) updateData.date = new Date(data.date);
  if (data.dueDate) updateData.dueDate = new Date(data.dueDate);
  if (data.lineItems) updateData.lineItems = data.lineItems;

  const purchase = await prisma.purchase.update({ where: { id }, data: updateData });
  return c.json(purchase);
});

purchases.delete("/:id", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");

  const existing = await prisma.purchase.findFirst({ where: { id, userId } });
  if (!existing) {
    return c.json({ error: "Purchase not found" }, 404);
  }

  await prisma.purchase.delete({ where: { id } });
  return c.json({ message: "Purchase deleted successfully" });
});

purchases.post("/bulk/mark-paid", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const { ids } = await c.req.json<{ ids: string[] }>();

  const result = await prisma.purchase.updateMany({
    where: { id: { in: ids }, userId },
    data: { status: "paid" },
  });

  return c.json({ updated: result.count });
});

purchases.post("/bulk/delete", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const { ids } = await c.req.json<{ ids: string[] }>();

  const result = await prisma.purchase.deleteMany({
    where: { id: { in: ids }, userId },
  });

  return c.json({ deleted: result.count });
});

export default purchases;
