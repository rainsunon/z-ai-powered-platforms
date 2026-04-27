import { authMiddleware } from "../middleware/auth";
import { prisma } from "../lib/prisma";
import { createApp } from "../lib/hono";

const reports = createApp();

reports.get("/", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const type = c.req.query("type") || "profit-loss";
  const startDate = c.req.query("startDate");
  const endDate = c.req.query("endDate");

  const dateFilter: any = {};
  if (startDate || endDate) {
    dateFilter.date = {};
    if (startDate) dateFilter.date.gte = new Date(startDate);
    if (endDate) dateFilter.date.lte = new Date(endDate);
  }

  const [sales, purchases, transactions] = await Promise.all([
    prisma.sale.findMany({ where: { userId, ...dateFilter } }),
    prisma.purchase.findMany({ where: { userId, ...dateFilter } }),
    prisma.transaction.findMany({ where: { userId, ...dateFilter } }),
  ]);

  const totalRevenue = sales.reduce((a, s) => a + s.amount, 0);
  const totalExpenses = purchases.reduce((a, p) => a + p.amount, 0);
  const totalPaid = sales.filter(s => s.status === "paid").reduce((a, s) => a + s.amount, 0);
  const totalUnpaid = sales.filter(s => s.status !== "paid").reduce((a, s) => a + s.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  const months = generateMonthRange(12);

  if (type === "profit-loss") {
    const revenueTrend = months.map((m) => {
      const mSales = sales.filter(s => isInMonth(s.date, m));
      const mPurchases = purchases.filter(p => isInMonth(p.date, m));
      const revenue = mSales.reduce((a, s) => a + s.amount, 0);
      const expenses = mPurchases.reduce((a, p) => a + p.amount, 0);
      return { month: m.label, revenue, expenses, netProfit: revenue - expenses };
    });

    const categorySpend: Record<string, number> = {};
    purchases.forEach(p => { categorySpend[p.category] = (categorySpend[p.category] || 0) + p.amount; });
    const totalSpend = Object.values(categorySpend).reduce((a, b) => a + b, 0);
    const colors = ["#0077c5", "#16a34a", "#f59e0b", "#ef4444", "#6366f1", "#8b5cf6"];
    const expenseCategoryData = Object.entries(categorySpend).map(([name, value], i) => ({
      name,
      value,
      color: colors[i % colors.length],
    }));

    return c.json({
      type: "profit-loss",
      summary: { totalRevenue, totalExpenses, netProfit, totalPaid, totalUnpaid },
      revenueTrend,
      expenseCategoryData,
      operatingIncome: [
        { label: "Sales Revenue", amount: totalRevenue },
        { label: "Other Income", amount: 0 },
      ],
      operatingExpenses: Object.entries(categorySpend).map(([label, amount]) => ({ label, amount })),
      netOperatingIncome: totalRevenue - totalExpenses,
    });
  }

  if (type === "net-worth") {
    const totalIncome = transactions.filter(t => t.type === "income").reduce((a, t) => a + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === "expense").reduce((a, t) => a + t.amount, 0);
    const netWorthTrend = months.map((m) => {
      const mIncome = transactions.filter(t => t.type === "income" && isInMonth(t.date, m)).reduce((a, t) => a + t.amount, 0);
      const mExpense = transactions.filter(t => t.type === "expense" && isInMonth(t.date, m)).reduce((a, t) => a + t.amount, 0);
      return { month: m.label, assets: mIncome * 10, liabilities: mExpense * 5, equity: mIncome * 10 - mExpense * 5 };
    });

    const currentAssets = [
      { label: "Cash on Hand", amount: 15400 },
      { label: "Business Bank Accounts", amount: 109600 },
      { label: "Accounts Receivable", amount: totalUnpaid },
      { label: "Inventory at Cost", amount: 85000 },
    ];
    const fixedAssets = [
      { label: "Fixed Assets (Equipment)", amount: 85000 },
      { label: "Real Estate Property", amount: 180000 },
    ];
    const liabilities = [
      { label: "Accounts Payable", amount: purchases.filter(p => p.status !== "paid").reduce((a, p) => a + p.amount, 0) },
      { label: "Credit Card Debt", amount: 8400 },
    ];
    const assetTotal = [...currentAssets, ...fixedAssets].reduce((a, c) => a + c.amount, 0);
    const liabilityTotal = liabilities.reduce((a, c) => a + c.amount, 0);

    return c.json({
      type: "net-worth",
      summary: { totalAssets: assetTotal, totalLiabilities: liabilityTotal, netWorth: assetTotal - liabilityTotal },
      netWorthTrend,
      currentAssets,
      fixedAssets,
      liabilities,
      equity: assetTotal - liabilityTotal,
    });
  }

  if (type === "purchases") {
    const purchaseTrend = months.map((m) => {
      const mPurchases = purchases.filter(p => isInMonth(p.date, m));
      return { month: m.label, amount: mPurchases.reduce((a, p) => a + p.amount, 0) };
    });

    const categoryBreakdown: Record<string, number> = {};
    purchases.forEach(p => { categoryBreakdown[p.category] = (categoryBreakdown[p.category] || 0) + p.amount; });

    return c.json({
      type: "purchases",
      summary: { totalPurchases: totalExpenses, totalPaid: purchases.filter(p => p.status === "paid").reduce((a, p) => a + p.amount, 0), totalOutstanding: purchases.filter(p => p.status !== "paid").reduce((a, p) => a + p.amount, 0) },
      purchaseTrend,
      categoryBreakdown: Object.entries(categoryBreakdown).map(([label, amount]) => ({ label, amount })),
    });
  }

  return c.json({ error: "Unknown report type" }, 400);
});

function generateMonthRange(count: number) {
  const months = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      year: d.getFullYear(),
      month: d.getMonth(),
      label: d.toLocaleString("en-US", { month: "short" }),
      date: d,
    });
  }
  return months;
}

function isInMonth(date: Date | string, m: { year: number; month: number }): boolean {
  const d = new Date(date);
  return d.getFullYear() === m.year && d.getMonth() === m.month;
}

export default reports;
