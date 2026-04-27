import { Sale } from "../types";

export const mockSales: Sale[] = [
  {
    id: "SLE-001",
    customer: "Acme Corp",
    date: "2026-06-20",
    dueDate: "2026-07-20",
    amount: 5400.00,
    status: "unpaid",
    category: "Services",
    reference: "INV-2026-001",
    customerAddress: "456 Enterprise Way, Suite 100, Austin, TX 78701",
    customerPhone: "+1 (512) 555-0123",
    customerEmail: "finance@acme.com",
    paymentTerms: "Net 30",
    lineItems: [
      { id: "LI-1", description: "Strategic Consulting - Q2", quantity: 1, unitPrice: 5000.00 },
      { id: "LI-2", description: "Expense Reimbursement", quantity: 1, unitPrice: 400.00 }
    ]
  },
  {
    id: "SLE-002",
    customer: "Global Tech Solutions",
    date: "2026-06-15",
    dueDate: "2026-06-15",
    amount: 1250.50,
    status: "paid",
    category: "Hardware",
    reference: "INV-2026-002",
    customerEmail: "billing@globaltech.io",
    lineItems: [
      { id: "LI-3", description: "NodeStone Server Rack", quantity: 1, unitPrice: 1250.50 }
    ]
  },
  {
    id: "SLE-003",
    customer: "Innovative Designs",
    date: "2026-05-10",
    dueDate: "2026-06-10",
    amount: 850.00,
    status: "overdue",
    category: "Design",
    reference: "INV-2026-003",
    customerEmail: "accounts@innovative.com",
    lineItems: [
      { id: "LI-4", description: "UI/UX Refresh - Mobile App", quantity: 1, unitPrice: 850.00 }
    ]
  }
];
