import { eq, and, desc, sql, ilike, gte, lte } from "drizzle-orm";
import type { PostgresDatabase } from "@vive/database/postgres";
import { healthAppointments } from "@vive/database/postgres";

export function createAppointmentController(db: PostgresDatabase) {
  return {
    async list(userId: string, page: number, limit: number, filters?: { status?: string; date?: string; startDate?: string; endDate?: string }) {
      const conditions = [eq(healthAppointments.userId, userId)];
      if (filters?.status) conditions.push(eq(healthAppointments.status, filters.status as any));
      if (filters?.date) conditions.push(eq(healthAppointments.appointmentDate, filters.date));
      if (filters?.startDate) conditions.push(gte(healthAppointments.appointmentDate, filters.startDate));
      if (filters?.endDate) conditions.push(lte(healthAppointments.appointmentDate, filters.endDate));

      const [items, totalResult] = await Promise.all([
        db.select().from(healthAppointments)
          .where(and(...conditions))
          .orderBy(desc(healthAppointments.appointmentDate))
          .limit(limit)
          .offset((page - 1) * limit),
        db.select({ count: sql<number>`count(*)::int` })
          .from(healthAppointments)
          .where(and(...conditions)),
      ]);

      return { items, total: totalResult[0].count, page, limit };
    },

    async getById(userId: string, id: string) {
      const [item] = await db.select().from(healthAppointments)
        .where(and(eq(healthAppointments.id, id), eq(healthAppointments.userId, userId)))
        .limit(1);
      return item ?? null;
    },

    async create(userId: string, data: any) {
      const [item] = await db.insert(healthAppointments)
        .values({ ...data, userId })
        .returning();
      return item;
    },

    async batchCreateForDates(userId: string, dates: string[], appointmentData: any) {
      const values = dates.map((date) => ({ ...appointmentData, userId, appointmentDate: date }));
      const items = await db.insert(healthAppointments).values(values).returning();
      return items;
    },

    async update(userId: string, id: string, data: any) {
      const [item] = await db.update(healthAppointments)
        .set({ ...data, updatedAt: new Date() })
        .where(and(eq(healthAppointments.id, id), eq(healthAppointments.userId, userId)))
        .returning();
      return item ?? null;
    },

    async delete(userId: string, id: string) {
      const [item] = await db.delete(healthAppointments)
        .where(and(eq(healthAppointments.id, id), eq(healthAppointments.userId, userId)))
        .returning();
      return !!item;
    },
  };
}
