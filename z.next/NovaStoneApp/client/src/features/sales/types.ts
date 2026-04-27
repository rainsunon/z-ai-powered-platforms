export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Sale {
  id: string;
  customer: string;
  customerAddress?: string;
  customerPhone?: string;
  customerEmail?: string;
  date: string;
  dueDate: string;
  amount: number;
  status: "paid" | "unpaid" | "overdue";
  category: string;
  reference: string;
  paymentTerms?: string;
  lineItems?: LineItem[];
  reminderSchedule?: "none" | "daily" | "weekly" | "once_on_due";
  customReminderMessage?: string;
}
