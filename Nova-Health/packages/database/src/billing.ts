import { pgTable, serial, text, timestamp, boolean, jsonb, numeric } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';

export const paymentMethods = pgTable('payment_methods', {
  id: serial('id').primaryKey(),
  userId: serial('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  type: text('type', {
    enum: ['credit_card', 'debit_card', 'bank_account'],
  }).notNull(),
  isDefault: boolean('is_default').notNull().default(false),
  status: text('status', {
    enum: ['active', 'inactive', 'expired', 'cancelled'],
  }).notNull(),
  cardDetails: jsonb('card_details').$type<{
    last4: string;
    brand: string;
    expiryMonth: number;
    expiryYear: number;
    cardholderName?: string;
  }>(),
  bankDetails: jsonb('bank_details').$type<{
    last4: string;
    bankName: string;
    routingNumber: string;
    accountType?: 'checking' | 'savings';
  }>(),
  stripePaymentMethodId: text('stripe_payment_method_id'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const subscriptions = pgTable('subscriptions', {
  id: serial('id').primaryKey(),
  userId: serial('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  planId: text('plan_id').notNull(),
  stripeSubscriptionId: text('stripe_subscription_id'),
  status: text('status', {
    enum: ['active', 'past_due', 'cancelled', 'expired'],
  }).notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  autoRenew: boolean('auto_renew').notNull().default(true),
  features: jsonb('features').$type<string[]>(),
  metadata: jsonb('metadata').$type<{
    planName?: string;
    price?: number;
    currency?: string;
    billingCycle?: 'monthly' | 'yearly';
  }>(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const invoices = pgTable('invoices', {
  id: serial('id').primaryKey(),
  userId: serial('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  invoiceNumber: text('invoice_number').notNull().unique(),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').notNull().default('USD'),
  status: text('status', {
    enum: ['pending', 'paid', 'failed', 'cancelled'],
  }).notNull(),
  dueDate: timestamp('due_date').notNull(),
  paidAt: timestamp('paid_at'),
  items: jsonb('items').$type<Array<{
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>>(),
  metadata: jsonb('metadata').$type<{
    stripeInvoiceId?: string;
    subscriptionId?: number;
    billingPeriod?: {
      start: string;
      end: string;
    };
  }>(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const paymentTransactions = pgTable('payment_transactions', {
  id: serial('id').primaryKey(),
  userId: serial('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  invoiceId: serial('invoice_id').references(() => invoices.id, { onDelete: 'set null' }),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').notNull().default('USD'),
  status: text('status', {
    enum: ['pending', 'completed', 'failed', 'refunded'],
  }).notNull(),
  paymentMethodId: serial('payment_method_id')
    .notNull()
    .references(() => paymentMethods.id, { onDelete: 'restrict' }),
  transactionId: text('transaction_id'),
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  metadata: jsonb('metadata').$type<{
    failureReason?: string;
    refundReason?: string;
    refundedAmount?: number;
  }>(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const paymentMethodsRelations = relations(paymentMethods, ({ one, many }) => ({
  user: one(users, {
    fields: [paymentMethods.userId],
    references: [users.id],
  }),
  transactions: many(paymentTransactions),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
}));

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
  user: one(users, {
    fields: [invoices.userId],
    references: [users.id],
  }),
  transactions: many(paymentTransactions),
}));

export const paymentTransactionsRelations = relations(paymentTransactions, ({ one }) => ({
  user: one(users, {
    fields: [paymentTransactions.userId],
    references: [users.id],
  }),
  invoice: one(invoices, {
    fields: [paymentTransactions.invoiceId],
    references: [invoices.id],
  }),
  paymentMethod: one(paymentMethods, {
    fields: [paymentTransactions.paymentMethodId],
    references: [paymentMethods.id],
  }),
}));
