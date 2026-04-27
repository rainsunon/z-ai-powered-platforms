import { zValidator } from "@hono/zod-validator";
import { authMiddleware } from "../middleware/auth";
import { prisma } from "../lib/prisma";
import { CreateInvoiceSchema, UpdateInvoiceSchema } from "../schemas";
import { createApp } from "../lib/hono";

const invoices = createApp();

invoices.get("/", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const status = c.req.query("status");
  const search = c.req.query("search") || "";
  const page = Number(c.req.query("page")) || 1;
  const limit = Number(c.req.query("limit")) || 50;
  const skip = (page - 1) * limit;

  const where: any = { userId };
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { invoiceNumber: { contains: search, mode: "insensitive" } },
      { customer: { name: { contains: search, mode: "insensitive" } } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.invoice.findMany({
      where,
      include: { customer: true },
      orderBy: { date: "desc" },
      skip,
      take: limit,
    }),
    prisma.invoice.count({ where }),
  ]);

  return c.json({ items, total, page, limit, totalPages: Math.ceil(total / limit) });
});

invoices.get("/stats", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const [overdue, upcoming, all] = await Promise.all([
    prisma.invoice.aggregate({ where: { userId, status: "overdue" }, _sum: { amountDue: true }, _count: true }),
    prisma.invoice.aggregate({ where: { userId, status: "unpaid" }, _sum: { amountDue: true }, _count: true }),
    prisma.invoice.aggregate({ where: { userId }, _sum: { total: true, amountDue: true }, _count: true }),
  ]);

  return c.json({
    overdue: { amount: overdue._sum.amountDue || 0, count: overdue._count || 0 },
    upcoming: { amount: upcoming._sum.amountDue || 0, count: upcoming._count || 0 },
    total: { amount: all._sum.total || 0, due: all._sum.amountDue || 0, count: all._count || 0 },
  });
});

invoices.get("/:id", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");

  const invoice = await prisma.invoice.findFirst({
    where: { id, userId },
    include: { customer: true },
  });

  if (!invoice) {
    return c.json({ error: "Invoice not found" }, 404);
  }

  return c.json(invoice);
});

invoices.post("/", authMiddleware, zValidator("json", CreateInvoiceSchema), async (c) => {
  const userId = c.get("userId");
  const data = c.req.valid("json") as any;

  if (!data.invoiceNumber) {
    const count = await prisma.invoice.count({ where: { userId } });
    const year = new Date().getFullYear();
    data.invoiceNumber = `INV-${year}-${String(count + 1).padStart(4, '0')}`;
  }

  const invoice = await prisma.invoice.create({
    data: {
      customerId: data.customerId,
      invoiceNumber: data.invoiceNumber,
      status: data.status || "draft",
      date: new Date(data.date),
      dueDate: new Date(data.dueDate),
      total: data.total,
      amountDue: data.amountDue ?? data.total,
      currency: data.currency || "USD",
      lineItems: data.lineItems || [],
      payments: data.payments,
      taxDetails: data.taxDetails,
      discounts: data.discounts,
      notes: data.notes,
      attachments: data.attachments,
      reminders: data.reminders,
      userId,
    },
    include: { customer: true },
  });

  return c.json(invoice, 201);
});

invoices.patch("/:id", authMiddleware, zValidator("json", UpdateInvoiceSchema), async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");
  const data = c.req.valid("json") as any;

  const existing = await prisma.invoice.findFirst({ where: { id, userId } });
  if (!existing) {
    return c.json({ error: "Invoice not found" }, 404);
  }

  const updateData: any = { ...data };
  if (data.date) updateData.date = new Date(data.date);
  if (data.dueDate) updateData.dueDate = new Date(data.dueDate);

  const invoice = await prisma.invoice.update({
    where: { id },
    data: updateData,
    include: { customer: true },
  });

  return c.json(invoice);
});

invoices.delete("/:id", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");

  const existing = await prisma.invoice.findFirst({ where: { id, userId } });
  if (!existing) {
    return c.json({ error: "Invoice not found" }, 404);
  }

  await prisma.invoice.delete({ where: { id } });
  return c.json({ message: "Invoice deleted successfully" });
});

invoices.post("/:id/pay", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");
  const body = await c.req.json<{ method?: string }>().catch(() => ({ method: "manual" }));

  const existing = await prisma.invoice.findFirst({ where: { id, userId } });
  if (!existing) {
    return c.json({ error: "Invoice not found" }, 404);
  }

  const invoice = await prisma.invoice.update({
    where: { id },
    data: {
      status: "paid",
      amountDue: 0,
      payments: {
        ...(existing.payments as any || {}),
        records: [
          ...((existing.payments as any)?.records || []),
          {
            date: new Date().toISOString(),
            amount: existing.amountDue,
            method: body.method || "manual",
          },
        ],
      },
    },
    include: { customer: true },
  });

  return c.json(invoice);
});

export default invoices;
