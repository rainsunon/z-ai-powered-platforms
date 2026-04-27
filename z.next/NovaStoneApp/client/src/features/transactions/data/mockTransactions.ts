import { Transaction } from "../types";

export const mockTransactions: Transaction[] = [
  { id: "TRX-001", date: "Apr 22, 2026", description: "Metro", account: "Cash on Hand", category: "Meals and Entertainment", amount: 5.41, hasReceipt: true, isReconciled: true },
  { id: "TRX-002", date: "Apr 21, 2026", description: "Circle K", account: "Cash on Hand", category: "Meals and Entertainment", amount: 56.00, hasReceipt: true, isReconciled: true },
  { id: "TRX-003", date: "Apr 18, 2026", description: "Yonge Weldrick Dental", account: "Cash on Hand", category: "Health and life", amount: 150.00, hasReceipt: true, isReconciled: true },
  { id: "TRX-004", date: "Apr 15, 2026", description: "Chingu Korean Restaurant", account: "Unknown Account", category: "Uncategorized Expense", amount: 19.20, hasReceipt: true, isReconciled: false, categoryIsUncertain: true },
  { id: "TRX-005", date: "Apr 9, 2026", description: "Costco Wholesale", account: "Unknown Account", category: "Uncategorized Expense", amount: 223.95, hasReceipt: true, isReconciled: false, categoryIsUncertain: true },
  { id: "TRX-006", date: "Mar 27, 2026", description: "Metro", account: "Cash on Hand", category: "Meals and Entertainment", amount: 3.36, hasReceipt: true, isReconciled: true },
];
