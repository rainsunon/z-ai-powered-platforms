import { pgTable, text, integer, serial, timestamp } from "drizzle-orm/pg-core";

export const rateLimitRules = pgTable("rate_limit_rules", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(), // e.g., "user:123", "ip:192.168.1.1", "global"
  type: text("type").notNull(), // "TOKEN_BUCKET", "FIXED_WINDOW", etc. (We use Token Bucket mainly)
  points: integer("points").notNull(), // Burst Capacity
  duration: integer("duration").notNull(), // Per duration (seconds). Rate = points / duration
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type RateLimitRule = typeof rateLimitRules.$inferSelect;
export type NewRateLimitRule = typeof rateLimitRules.$inferInsert;
