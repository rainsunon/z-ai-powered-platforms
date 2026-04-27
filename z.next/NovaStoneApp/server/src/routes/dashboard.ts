import { authMiddleware } from "../middleware/auth";
import { prisma } from "../lib/prisma";
import { createApp } from "../lib/hono";

const dashboard = createApp();

dashboard.get("/", authMiddleware, async (c) => {
  const userId = c.get("userId");

  const [sales, purchases, transactions] = await Promise.all([
    prisma.sale.findMany({ where: { userId } }),
    prisma.purchase.findMany({ where: { userId } }),
    prisma.transaction.findMany({ where: { userId } }),
  ]);

  const totalRevenue = sales.reduce((acc, s) => acc + s.amount, 0);
  const totalPaid = sales.filter(s => s.status === "paid").reduce((acc, s) => acc + s.amount, 0);
  const totalUnpaid = sales.filter(s => s.status === "unpaid").reduce((acc, s) => acc + s.amount, 0);
  const totalOverdue = sales.filter(s => s.status === "overdue").reduce((acc, s) => acc + s.amount, 0);

  const totalExpenses = purchases.reduce((acc, p) => acc + p.amount, 0);
  const totalPaidBills = purchases.filter(p => p.status === "paid").reduce((acc, p) => acc + p.amount, 0);
  const totalUnpaidBills = purchases.filter(p => p.status === "unpaid").reduce((acc, p) => acc + p.amount, 0);
  const totalOverdueBills = purchases.filter(p => p.status === "overdue").reduce((acc, p) => acc + p.amount, 0);

  const totalIncome = transactions.filter(t => t.type === "income").reduce((acc, t) => acc + t.amount, 0);
  const totalExpenseTx = transactions.filter(t => t.type === "expense").reduce((acc, t) => acc + t.amount, 0);

  const unpaidCount = sales.filter(s => s.status !== "paid").length;
  const unpaidBillCount = purchases.filter(p => p.status !== "paid").length;

  const kpis = {
    totalRevenue,
    totalPaid,
    totalUnpaid,
    totalOverdue,
    totalExpenses,
    totalPaidBills,
    totalUnpaidBills,
    totalOverdueBills,
    netIncome: totalRevenue - totalExpenses,
    totalIncomeTx: totalIncome,
    totalExpenseTx: totalExpenseTx,
    unpaidCount,
    unpaidBillCount,
    salesCount: sales.length,
    purchaseCount: purchases.length,
    customerCount: await prisma.customer.count({ where: { userId } }),
    invoiceCount: await prisma.invoice.count({ where: { userId } }),
  };

  const months = generateMonthRange(12);
  const cashFlow = await Promise.all(
    months.map(async (m) => {
      const monthSales = sales.filter(s => {
        const d = new Date(s.date);
        return d.getFullYear() === m.year && d.getMonth() === m.month;
      });
      const monthPurchases = purchases.filter(p => {
        const d = new Date(p.date);
        return d.getFullYear() === m.year && d.getMonth() === m.month;
      });
      const inflow = monthSales.reduce((a, s) => a + s.amount, 0);
      const outflow = monthPurchases.reduce((a, p) => a + p.amount, 0);
      return { name: m.label, inflow, outflow, net: inflow - outflow };
    })
  );

  const profitLoss = months.map((m) => {
    const monthSales = sales.filter(s => {
      const d = new Date(s.date);
      return d.getFullYear() === m.year && d.getMonth() === m.month;
    });
    const monthPurchases = purchases.filter(p => {
      const d = new Date(p.date);
      return d.getFullYear() === m.year && d.getMonth() === m.month;
    });
    return {
      name: m.label,
      income: monthSales.reduce((a, s) => a + s.amount, 0),
      expense: monthPurchases.reduce((a, p) => a + p.amount, 0),
    };
  });

  const categorySpend: Record<string, number> = {};
  purchases.forEach(p => {
    categorySpend[p.category] = (categorySpend[p.category] || 0) + p.amount;
  });
  const totalSpend = Object.values(categorySpend).reduce((a, b) => a + b, 0);
  const expenseBreakdown = Object.entries(categorySpend).map(([name, value]) => ({
    name,
    value: totalSpend > 0 ? Math.round((value / totalSpend) * 1000) / 10 : 0,
    amount: value,
  }));

  const overdueItems = [
    ...sales.filter(s => s.status === "overdue").map(s => ({ name: s.reference, amount: s.amount, type: "sale" as const })),
    ...purchases.filter(p => p.status === "overdue").map(p => ({ name: p.vendor, amount: p.amount, type: "purchase" as const })),
  ];

  return c.json({
    kpis,
    cashFlow,
    profitLoss,
    expenseBreakdown,
    overdueItems,
    recentSales: sales.slice(0, 5),
    recentPurchases: purchases.slice(0, 5),
  });
});

function generateMonthRange(count: number) {
  const months = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      year: d.getFullYear(),
      month: d.getMonth(),
      label: d.toLocaleString("en-US", { month: "short" }) + " " + String(d.getFullYear()).slice(2),
    });
  }
  return months;
}

export default dashboard;
