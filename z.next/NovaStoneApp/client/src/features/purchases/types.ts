export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Purchase {
  id: string;
  vendor: string;
  vendorAddress?: string;
  vendorPhone?: string;
  vendorEmail?: string;
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
