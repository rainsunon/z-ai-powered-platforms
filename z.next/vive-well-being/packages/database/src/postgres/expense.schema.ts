import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  numeric,
  pgEnum,
  jsonb,
  boolean,
  index,
} from "drizzle-orm/pg-core";

export const expenseCategoryEnum = pgEnum("expense_category", [
  "FOOD",
  "TRANSPORT",
  "HOUSING",
  "UTILITIES",
  "ENTERTAINMENT",
  "HEALTHCARE",
  "EDUCATION",
  "SHOPPING",
  "TRAVEL",
  "OTHER",
]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "CASH",
  "CREDIT_CARD",
  "DEBIT_CARD",
  "BANK_TRANSFER",
  "DIGITAL_WALLET",
  "OTHER",
]);

export const expenses = pgTable("expenses", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  category: expenseCategoryEnum("category").notNull(),
  paymentMethod: paymentMethodEnum("payment_method").notNull(),
  description: text("description"),
  merchantName: varchar("merchant_name", { length: 255 }),
  receiptUrl: text("receipt_url"),
  isRecurring: boolean("is_recurring").default(false).notNull(),
  tags: jsonb("tags").$type<string[]>().default([]),
  expenseDate: timestamp("expense_date").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_expenses_user_id").on(table.userId),
  index("idx_expenses_category").on(table.category),
  index("idx_expenses_expense_date").on(table.expenseDate),
]);

export const expenseBudgets = pgTable("expense_budgets", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  category: expenseCategoryEnum("category").notNull(),
  monthlyLimit: numeric("monthly_limit", { precision: 12, scale: 2 }).notNull(),
  currentSpend: numeric("current_spend", { precision: 12, scale: 2 }).default("0").notNull(),
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_expense_budgets_user_id").on(table.userId),
]);
