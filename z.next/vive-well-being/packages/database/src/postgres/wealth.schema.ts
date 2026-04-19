import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  numeric,
  pgEnum,
  jsonb,
  index,
} from "drizzle-orm/pg-core";

export const assetTypeEnum = pgEnum("asset_type", [
  "STOCK",
  "BOND",
  "REAL_ESTATE",
  "CRYPTO",
  "MUTUAL_FUND",
  "ETF",
  "COMMODITY",
  "CASH",
  "OTHER",
]);

export const transactionTypeEnum = pgEnum("transaction_type", [
  "BUY",
  "SELL",
  "DIVIDEND",
  "DEPOSIT",
  "WITHDRAWAL",
  "TRANSFER",
]);

export const wealthPortfolios = pgTable("wealth_portfolios", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  totalValue: numeric("total_value", { precision: 15, scale: 2 }).default("0").notNull(),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_wealth_portfolios_user_id").on(table.userId),
]);

export const wealthAssets = pgTable("wealth_assets", {
  id: uuid("id").defaultRandom().primaryKey(),
  portfolioId: uuid("portfolio_id").notNull(),
  assetType: assetTypeEnum("asset_type").notNull(),
  symbol: varchar("symbol", { length: 50 }),
  name: varchar("name", { length: 255 }).notNull(),
  quantity: numeric("quantity", { precision: 15, scale: 4 }).notNull(),
  averageCost: numeric("average_cost", { precision: 15, scale: 2 }).notNull(),
  currentPrice: numeric("current_price", { precision: 15, scale: 2 }),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  acquiredAt: timestamp("acquired_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_wealth_assets_portfolio_id").on(table.portfolioId),
]);

export const wealthTransactions = pgTable("wealth_transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  portfolioId: uuid("portfolio_id").notNull(),
  assetId: uuid("asset_id"),
  type: transactionTypeEnum("type").notNull(),
  quantity: numeric("quantity", { precision: 15, scale: 4 }).notNull(),
  price: numeric("price", { precision: 15, scale: 2 }).notNull(),
  fees: numeric("fees", { precision: 12, scale: 2 }).default("0").notNull(),
  notes: text("notes"),
  transactionDate: timestamp("transaction_date").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_wealth_transactions_portfolio_id").on(table.portfolioId),
  index("idx_wealth_transactions_asset_id").on(table.assetId),
]);
