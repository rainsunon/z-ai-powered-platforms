import { eq, and, desc, sql, ilike, gte, lte } from "drizzle-orm";
import type { PostgresDatabase } from "@vive/database/postgres";
import { healthLogs } from "@vive/database/postgres";

export function createHealthLogController(db: PostgresDatabase) {
  return {
    async list(userId: string, page: number, limit: number, filters?: { logType?: string; startDate?: string; endDate?: string; search?: string }) {
      const conditions = [eq(healthLogs.userId, userId)];
      if (filters?.logType) conditions.push(eq(healthLogs.logType, filters.logType as any));
      if (filters?.startDate) conditions.push(gte(healthLogs.loggedAt, new Date(filters.startDate)));
      if (filters?.endDate) conditions.push(lte(healthLogs.loggedAt, new Date(filters.endDate)));
      if (filters?.search) conditions.push(ilike(healthLogs.title, `%${filters.search}%`));

      const [items, totalResult] = await Promise.all([
        db.select().from(healthLogs)
          .where(and(...conditions))
          .orderBy(desc(healthLogs.loggedAt))
          .limit(limit)
          .offset((page - 1) * limit),
        db.select({ count: sql<number>`count(*)::int` })
          .from(healthLogs)
          .where(and(...conditions)),
      ]);

      return { items, total: totalResult[0].count, page, limit };
    },

    async getById(userId: string, id: string) {
      const [item] = await db.select().from(healthLogs)
        .where(and(eq(healthLogs.id, id), eq(healthLogs.userId, userId)))
        .limit(1);
      return item ?? null;
    },

    async create(userId: string, data: any) {
      const [item] = await db.insert(healthLogs)
        .values({ ...data, userId })
        .returning();
      return item;
    },

    async update(userId: string, id: string, data: any) {
      const [item] = await db.update(healthLogs)
        .set({ ...data, updatedAt: new Date() })
        .where(and(eq(healthLogs.id, id), eq(healthLogs.userId, userId)))
        .returning();
      return item ?? null;
    },

    async delete(userId: string, id: string) {
      const [item] = await db.delete(healthLogs)
        .where(and(eq(healthLogs.id, id), eq(healthLogs.userId, userId)))
        .returning();
      return !!item;
    },
  };
}
