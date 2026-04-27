import { Purchase } from "../types";

export const mockPurchases: Purchase[] = [
  {
    id: "PUR-001",
    vendor: "Cloudflare Inc.",
    date: "2026-06-15",
    dueDate: "2026-06-30",
    amount: 250.00,
    status: "paid",
    category: "Software",
    reference: "INV-8821",
    vendorAddress: "101 Townsend St, San Francisco, CA 94107",
    vendorPhone: "+1 (888) 992-5683",
    vendorEmail: "billing@cloudflare.com",
    lineItems: [
      { id: "LI-1", description: "Pro Plan Subscription - Annual", quantity: 1, unitPrice: 200.00 },
      { id: "LI-2", description: "Argo Smart Routing", quantity: 1, unitPrice: 50.00 }
    ]
  },
  {
    id: "PUR-002",
    vendor: "WeWork Global",
    date: "2026-06-18",
    dueDate: "2026-07-01",
    amount: 1200.00,
    status: "unpaid",
    category: "Rent",
    reference: "WW-JUN-26",
    vendorAddress: "115 Broadway, New York, NY 10006",
    vendorPhone: "+1 (646) 389-3922",
    vendorEmail: "support@wework.com",
    lineItems: [
      { id: "LI-3", description: "Dedicated Desk - June", quantity: 2, unitPrice: 600.00 }
    ]
  },
  {
    id: "PUR-003",
    vendor: "Stripe Terminal",
    date: "2026-06-10",
    dueDate: "2026-06-24",
    amount: 450.00,
    status: "paid",
    category: "Hardware",
    reference: "ST-092",
    lineItems: [
      { id: "LI-4", description: "Stripe Reader S700", quantity: 1, unitPrice: 350.00 },
      { id: "LI-5", description: "Charging Dock", quantity: 2, unitPrice: 50.00 }
    ]
  },
  {
    id: "PUR-004",
    vendor: "Google Workspace",
    date: "2026-06-01",
    dueDate: "2026-06-15",
    amount: 84.50,
    status: "paid",
    category: "Software",
    reference: "GWS-2026-06",
    lineItems: [
      { id: "LI-6", description: "Business Standard License", quantity: 5, unitPrice: 12.00 },
      { id: "LI-7", description: "Additional Storage (1TB)", quantity: 1, unitPrice: 24.50 }
    ]
  },
  {
    id: "PUR-005",
    vendor: "Amazon Web Services",
    date: "2026-05-30",
    dueDate: "2026-06-12",
    amount: 3450.20,
    status: "paid",
    category: "Software",
    reference: "AWS-9921",
    lineItems: [
      { id: "LI-8", description: "EC2 Reserved Instances", quantity: 4, unitPrice: 800.00 },
      { id: "LI-9", description: "S3 Storage - Standard", quantity: 1, unitPrice: 250.20 }
    ]
  },
  {
    id: "PUR-006",
    vendor: "Logistics Pro",
    date: "2026-05-15",
    dueDate: "2026-05-29",
    amount: 500.00,
    status: "overdue",
    category: "Shipping",
    reference: "LP-001",
    lineItems: [
      { id: "LI-10", description: "International Freight", quantity: 1, unitPrice: 500.00 }
    ]
  },
];
