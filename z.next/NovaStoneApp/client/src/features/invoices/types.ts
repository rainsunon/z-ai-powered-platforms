export interface Invoice {
  id: string;
  status: "Paid" | "Unpaid" | "Draft" | "Overdue";
  date: string;
  number: string;
  customer: string;
  total: number;
  amountDue: number;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}
