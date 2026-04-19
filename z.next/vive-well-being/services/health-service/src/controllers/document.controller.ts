import { eq, and, desc, sql, ilike, gte, lte } from "drizzle-orm";
import type { PostgresDatabase } from "@vive/database/postgres";
import { healthDocuments } from "@vive/database/postgres";

export function createDocumentController(db: PostgresDatabase) {
  return {
    async list(userId: string, page: number, limit: number, filters?: { documentType?: string; search?: string; startDate?: string; endDate?: string }) {
      const conditions = [eq(healthDocuments.userId, userId)];
      if (filters?.documentType) conditions.push(eq(healthDocuments.documentType, filters.documentType as any));
      if (filters?.startDate) conditions.push(gte(healthDocuments.issuedDate, filters.startDate));
      if (filters?.endDate) conditions.push(lte(healthDocuments.issuedDate, filters.endDate));
      if (filters?.search) {
        conditions.push(
          sql`(${healthDocuments.title} ILIKE ${`%${filters.search}%`} OR ${healthDocuments.description} ILIKE ${`%${filters.search}%`} OR ${healthDocuments.tags}::text ILIKE ${`%${filters.search}%`})`
        );
      }

      const [items, totalResult] = await Promise.all([
        db.select().from(healthDocuments)
          .where(and(...conditions))
          .orderBy(desc(healthDocuments.createdAt))
          .limit(limit)
          .offset((page - 1) * limit),
        db.select({ count: sql<number>`count(*)::int` })
          .from(healthDocuments)
          .where(and(...conditions)),
      ]);

      return { items, total: totalResult[0].count, page, limit };
    },

    async getById(userId: string, id: string) {
      const [item] = await db.select().from(healthDocuments)
        .where(and(eq(healthDocuments.id, id), eq(healthDocuments.userId, userId)))
        .limit(1);
      return item ?? null;
    },

    async create(userId: string, data: any) {
      const [item] = await db.insert(healthDocuments)
        .values({ ...data, userId })
        .returning();
      return item;
    },

    async update(userId: string, id: string, data: any) {
      const [item] = await db.update(healthDocuments)
        .set({ ...data, updatedAt: new Date() })
        .where(and(eq(healthDocuments.id, id), eq(healthDocuments.userId, userId)))
        .returning();
      return item ?? null;
    },

    async delete(userId: string, id: string) {
      const [item] = await db.delete(healthDocuments)
        .where(and(eq(healthDocuments.id, id), eq(healthDocuments.userId, userId)))
        .returning();
      return !!item;
    },
  };
}
