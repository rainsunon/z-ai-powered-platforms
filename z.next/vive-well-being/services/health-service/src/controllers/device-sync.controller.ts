import { eq, and, desc } from "drizzle-orm";
import type { PostgresDatabase } from "@vive/database/postgres";
import { healthDeviceSyncs } from "@vive/database/postgres";

export function createDeviceSyncController(db: PostgresDatabase) {
  return {
    async list(userId: string) {
      return db.select().from(healthDeviceSyncs)
        .where(eq(healthDeviceSyncs.userId, userId))
        .orderBy(desc(healthDeviceSyncs.createdAt));
    },

    async getById(userId: string, id: string) {
      const [item] = await db.select().from(healthDeviceSyncs)
        .where(and(eq(healthDeviceSyncs.id, id), eq(healthDeviceSyncs.userId, userId)))
        .limit(1);
      return item ?? null;
    },

    async create(userId: string, data: any) {
      const [item] = await db.insert(healthDeviceSyncs)
        .values({ ...data, userId })
        .returning();
      return item;
    },

    async update(userId: string, id: string, data: any) {
      const [item] = await db.update(healthDeviceSyncs)
        .set({ ...data, updatedAt: new Date() })
        .where(and(eq(healthDeviceSyncs.id, id), eq(healthDeviceSyncs.userId, userId)))
        .returning();
      return item ?? null;
    },

    async sync(userId: string, id: string) {
      const [item] = await db.update(healthDeviceSyncs)
        .set({ syncStatus: "SYNCING", updatedAt: new Date() })
        .where(and(eq(healthDeviceSyncs.id, id), eq(healthDeviceSyncs.userId, userId)))
        .returning();

      if (item) {
        const [synced] = await db.update(healthDeviceSyncs)
          .set({ syncStatus: "SYNCED", lastSyncedAt: new Date(), updatedAt: new Date() })
          .where(eq(healthDeviceSyncs.id, id))
          .returning();
        return synced;
      }
      return null;
    },

    async delete(userId: string, id: string) {
      const [item] = await db.delete(healthDeviceSyncs)
        .where(and(eq(healthDeviceSyncs.id, id), eq(healthDeviceSyncs.userId, userId)))
        .returning();
      return !!item;
    },
  };
}
