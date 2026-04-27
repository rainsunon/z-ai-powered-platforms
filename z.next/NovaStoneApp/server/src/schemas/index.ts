import { z } from "zod";

// ============ Customer Schemas ============

export const CustomerSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  balance: z.number().default(0),
  overdue: z.number().default(0),
  address: z.any().optional(),
  contacts: z.any().optional(),
  paymentInfo: z.any().optional(),
  customFields: z.any().optional(),
  metadata: z.any().optional(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const CreateCustomerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.any().optional(),
  contacts: z.any().optional(),
  paymentInfo: z.any().optional(),
  customFields: z.any().optional()
});

export const UpdateCustomerSchema = CreateCustomerSchema.partial();

// ============ Product Schemas ============

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  price: z.number(),
  sellThis: z.boolean(),
  buyThis: z.boolean(),
  pricing: z.any().optional(),
  inventory: z.any().optional(),
  categories: z.any().optional(),
  images: z.any().optional(),
  variants: z.any().optional(),
  customFields: z.any().optional(),
  metadata: z.any().optional(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const CreateProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number().min(0),
  sellThis: z.boolean().default(true),
  buyThis: z.boolean().default(false),
  pricing: z.any().optional(),
  inventory: z.any().optional(),
  categories: z.any().optional(),
  images: z.any().optional(),
  variants: z.any().optional(),
  customFields: z.any().optional()
});

export const UpdateProductSchema = CreateProductSchema.partial();

// ============ Invoice Schemas ============

export const InvoiceSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  invoiceNumber: z.string(),
  status: z.enum(["unpaid", "paid", "overdue", "draft"]),
  date: z.string(),
  dueDate: z.string(),
  total: z.number(),
  amountDue: z.number(),
  currency: z.string(),
  lineItems: z.any(),
  payments: z.any().optional(),
  taxDetails: z.any().optional(),
  discounts: z.any().optional(),
  notes: z.any().optional(),
  attachments: z.any().optional(),
  reminders: z.any().optional(),
  customFields: z.any().optional(),
  metadata: z.any().optional(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const CreateInvoiceSchema = z.object({
  customerId: z.string(),
  invoiceNumber: z.string().optional(),
  status: z.enum(["unpaid", "paid", "overdue", "draft"]).default("draft"),
  date: z.string(),
  dueDate: z.string(),
  total: z.number(),
  amountDue: z.number(),
  currency: z.string().default("USD"),
  lineItems: z.any(),
  payments: z.any().optional(),
  taxDetails: z.any().optional(),
  discounts: z.any().optional(),
  notes: z.any().optional(),
  attachments: z.any().optional(),
  reminders: z.any().optional(),
  customFields: z.any().optional()
});

export const UpdateInvoiceSchema = CreateInvoiceSchema.partial();

// ============ Sale Schemas ============

export const SaleSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  reference: z.string(),
  category: z.string(),
  status: z.enum(["unpaid", "paid", "overdue"]),
  date: z.string(),
  dueDate: z.string(),
  amount: z.number(),
  currency: z.string(),
  lineItems: z.any(),
  paymentTerms: z.any().optional(),
  customerInfo: z.any().optional(),
  reminders: z.any().optional(),
  customFields: z.any().optional(),
  metadata: z.any().optional(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const CreateSaleSchema = z.object({
  customerId: z.string(),
  reference: z.string().optional(),
  category: z.string(),
  status: z.enum(["unpaid", "paid", "overdue"]).default("unpaid"),
  date: z.string(),
  dueDate: z.string(),
  amount: z.number(),
  currency: z.string().default("USD"),
  lineItems: z.any(),
  paymentTerms: z.any().optional(),
  customerInfo: z.any().optional(),
  reminders: z.any().optional(),
  customFields: z.any().optional()
});

export const UpdateSaleSchema = CreateSaleSchema.partial();

// ============ Estimate Schemas ============

export const EstimateSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  estimateNumber: z.string(),
  status: z.enum(["draft", "sent", "accepted", "rejected", "expired"]),
  date: z.string(),
  expiryDate: z.string().optional(),
  total: z.number(),
  currency: z.string(),
  lineItems: z.any(),
  terms: z.any().optional(),
  notes: z.any().optional(),
  attachments: z.any().optional(),
  customFields: z.any().optional(),
  metadata: z.any().optional(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const CreateEstimateSchema = z.object({
  customerId: z.string(),
  estimateNumber: z.string().optional(),
  status: z.enum(["draft", "sent", "accepted", "rejected", "expired"]).default("draft"),
  date: z.string(),
  expiryDate: z.string().optional(),
  total: z.number(),
  currency: z.string().default("USD"),
  lineItems: z.any(),
  terms: z.any().optional(),
  notes: z.any().optional(),
  attachments: z.any().optional(),
  customFields: z.any().optional()
});

export const UpdateEstimateSchema = CreateEstimateSchema.partial();

// ============ Purchase Schemas ============

export const PurchaseSchema = z.object({
  id: z.string(),
  vendor: z.string(),
  reference: z.string(),
  category: z.string(),
  status: z.string(),
  date: z.string(),
  dueDate: z.string().optional(),
  amount: z.number(),
  currency: z.string(),
  lineItems: z.any(),
  vendorInfo: z.any().optional(),
  paymentInfo: z.any().optional(),
  attachments: z.any().optional(),
  customFields: z.any().optional(),
  metadata: z.any().optional(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const CreatePurchaseSchema = z.object({
  vendor: z.string(),
  reference: z.string().optional(),
  category: z.string(),
  status: z.string().default("unpaid"),
  date: z.string(),
  dueDate: z.string().optional(),
  amount: z.number(),
  currency: z.string().default("USD"),
  lineItems: z.any(),
  vendorInfo: z.any().optional(),
  paymentInfo: z.any().optional(),
  attachments: z.any().optional(),
  customFields: z.any().optional()
});

export const UpdatePurchaseSchema = CreatePurchaseSchema.partial();

// ============ Transaction Schemas ============

export const TransactionSchema = z.object({
  id: z.string(),
  type: z.enum(["income", "expense", "transfer"]),
  category: z.string(),
  amount: z.number(),
  currency: z.string(),
  date: z.string(),
  description: z.string().optional(),
  account: z.any().optional(),
  tags: z.any().optional(),
  attachments: z.any().optional(),
  relatedTo: z.any().optional(),
  customFields: z.any().optional(),
  metadata: z.any().optional(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const CreateTransactionSchema = z.object({
  type: z.enum(["income", "expense", "transfer"]),
  category: z.string(),
  amount: z.number(),
  currency: z.string().default("USD"),
  date: z.string(),
  description: z.string().optional(),
  account: z.any().optional(),
  tags: z.any().optional(),
  attachments: z.any().optional(),
  relatedTo: z.any().optional(),
  customFields: z.any().optional()
});

export const UpdateTransactionSchema = CreateTransactionSchema.partial();

// ============ Common Schemas ============

export const ErrorSchema = z.object({
  error: z.string()
});

export const SuccessSchema = z.object({
  message: z.string()
});
