import { eq, and, desc, sql, ilike, or } from "drizzle-orm";
import type { PostgresDatabase } from "@vive/database/postgres";
import { healthMedications } from "@vive/database/postgres";

export function createMedicationController(db: PostgresDatabase) {
  return {
    async list(userId: string, page: number, limit: number, isActive?: boolean, search?: string) {
      const conditions = [eq(healthMedications.userId, userId)];
      if (isActive !== undefined) conditions.push(eq(healthMedications.isActive, isActive));
      if (search) conditions.push(ilike(healthMedications.name, `%${search}%`));

      const [items, totalResult] = await Promise.all([
        db.select().from(healthMedications)
          .where(and(...conditions))
          .orderBy(desc(healthMedications.createdAt))
          .limit(limit)
          .offset((page - 1) * limit),
        db.select({ count: sql<number>`count(*)::int` })
          .from(healthMedications)
          .where(and(...conditions)),
      ]);

      return { items, total: totalResult[0].count, page, limit };
    },

    async getById(userId: string, id: string) {
      const [item] = await db.select().from(healthMedications)
        .where(and(eq(healthMedications.id, id), eq(healthMedications.userId, userId)))
        .limit(1);
      return item ?? null;
    },

    async create(userId: string, data: any) {
      const [item] = await db.insert(healthMedications)
        .values({ ...data, userId })
        .returning();
      return item;
    },

    async update(userId: string, id: string, data: any) {
      const [item] = await db.update(healthMedications)
        .set({ ...data, updatedAt: new Date() })
        .where(and(eq(healthMedications.id, id), eq(healthMedications.userId, userId)))
        .returning();
      return item ?? null;
    },

    async delete(userId: string, id: string) {
      const [item] = await db.delete(healthMedications)
        .where(and(eq(healthMedications.id, id), eq(healthMedications.userId, userId)))
        .returning();
      return !!item;
    },
  };
}
