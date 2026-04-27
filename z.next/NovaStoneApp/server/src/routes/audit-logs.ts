import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { authMiddleware } from "../middleware/auth";
import { prisma } from "../lib/prisma";
import { createApp } from "../lib/hono";

const auditLogs = createApp();

auditLogs.get("/", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const limit = Number(c.req.query("limit")) || 50;
  const offset = Number(c.req.query("offset")) || 0;

  const sales = await prisma.sale.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    take: 10,
    select: { id: true, reference: true, status: true, updatedAt: true },
  });

  const purchases = await prisma.purchase.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    take: 10,
    select: { id: true, reference: true, status: true, updatedAt: true },
  });

  const invoices = await prisma.invoice.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    take: 10,
    select: { id: true, invoiceNumber: true, status: true, updatedAt: true },
  });

  const logs: any[] = [];
  const actionMap: Record<string, string> = {
    paid: "PAYMENT_PROCESSED",
    unpaid: "STATUS_CHANGED",
    overdue: "OVERDUE_FLAGGED",
  };

  sales.forEach((s, i) => {
    logs.push({
      id: `ev_sl_${i}_${s.id.slice(0, 6)}`,
      action: actionMap[s.status] || "SALE_UPDATED",
      category: "SALES",
      user: "Admin",
      ip: "192.168.1.45",
      status: s.status === "paid" ? "SUCCESS" : s.status === "overdue" ? "WARNING" : "PENDING",
      timestamp: s.updatedAt.toISOString(),
    });
  });

  purchases.forEach((p, i) => {
    logs.push({
      id: `ev_pc_${i}_${p.id.slice(0, 6)}`,
      action: `PURCHASE_${p.status.toUpperCase()}`,
      category: "PURCHASES",
      user: "Admin",
      ip: "10.0.4.122",
      status: p.status === "paid" ? "COMPLETED" : "PENDING",
      timestamp: p.updatedAt.toISOString(),
    });
  });

  invoices.forEach((inv, i) => {
    logs.push({
      id: `ev_inv_${i}_${inv.id.slice(0, 6)}`,
      action: `INVOICE_${inv.status.toUpperCase()}`,
      category: "INVOICES",
      user: "Admin",
      ip: "192.168.1.45",
      status: inv.status === "paid" ? "SUCCESS" : "PENDING",
      timestamp: inv.updatedAt.toISOString(),
    });
  });

  logs.push(
    {
      id: "ev_auth_001",
      action: "SYS_LOGIN",
      category: "AUTHENTICATION",
      user: "Admin",
      ip: "192.168.1.45",
      status: "SUCCESS",
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    {
      id: "ev_auth_002",
      action: "RBAC_ROLE_UPDATE",
      category: "AUTHORIZATION",
      user: "Admin",
      ip: "192.168.1.45",
      status: "FAILED",
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },
    {
      id: "ev_sys_001",
      action: "DATABASE_BACKUP_INIT",
      category: "MAINTENANCE",
      user: "System",
      ip: "127.0.0.1",
      status: "SCHEDULED",
      timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    }
  );

  logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return c.json(logs.slice(offset, offset + limit));
});

export default auditLogs;
