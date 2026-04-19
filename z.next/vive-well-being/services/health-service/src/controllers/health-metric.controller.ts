import { eq, and, desc, sql, gte, lte } from "drizzle-orm";
import type { PostgresDatabase } from "@vive/database/postgres";
import { healthMetrics } from "@vive/database/postgres";

export function createHealthMetricController(db: PostgresDatabase) {
  return {
    async list(userId: string, page: number, limit: number, filters?: { metricType?: string; startDate?: string; endDate?: string }) {
      const conditions = [eq(healthMetrics.userId, userId)];
      if (filters?.metricType) conditions.push(eq(healthMetrics.metricType, filters.metricType as any));
      if (filters?.startDate) conditions.push(gte(healthMetrics.recordedAt, new Date(filters.startDate)));
      if (filters?.endDate) conditions.push(lte(healthMetrics.recordedAt, new Date(filters.endDate)));

      const [items, totalResult] = await Promise.all([
        db.select().from(healthMetrics)
          .where(and(...conditions))
          .orderBy(desc(healthMetrics.recordedAt))
          .limit(limit)
          .offset((page - 1) * limit),
        db.select({ count: sql<number>`count(*)::int` })
          .from(healthMetrics)
          .where(and(...conditions)),
      ]);

      return { items, total: totalResult[0].count, page, limit };
    },

    async create(userId: string, data: any) {
      const [item] = await db.insert(healthMetrics)
        .values({ ...data, userId })
        .returning();
      return item;
    },

    async delete(userId: string, id: string) {
      const [item] = await db.delete(healthMetrics)
        .where(and(eq(healthMetrics.id, id), eq(healthMetrics.userId, userId)))
        .returning();
      return !!item;
    },

    async getTrend(userId: string, metricType: string, days: number = 30) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      return db.select({
        value: healthMetrics.value,
        unit: healthMetrics.unit,
        recordedAt: healthMetrics.recordedAt,
      })
        .from(healthMetrics)
        .where(and(
          eq(healthMetrics.userId, userId),
          eq(healthMetrics.metricType, metricType as any),
          gte(healthMetrics.recordedAt, startDate),
        ))
        .orderBy(healthMetrics.recordedAt);
    },
  };
}
