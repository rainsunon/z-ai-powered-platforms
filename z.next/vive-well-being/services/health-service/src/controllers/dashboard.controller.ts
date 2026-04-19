import { eq, sql, and, gte, desc } from "drizzle-orm";
import type { PostgresDatabase } from "@vive/database/postgres";
import { healthMetrics, healthLogs, healthMedications, healthAppointments, healthActivities, healthDeviceSyncs, healthDocuments } from "@vive/database/postgres";

export function createDashboardController(db: PostgresDatabase) {
  return {
    async getSummary(userId: string) {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const today = now.toISOString().split("T")[0];

      const [
        totalMetrics,
        recentLogs,
        activeMedications,
        upcomingAppointments,
        totalActivities,
        connectedDevices,
        totalDocuments,
        recentMetrics,
      ] = await Promise.all([
        db.select({ count: sql<number>`count(*)::int` })
          .from(healthMetrics)
          .where(and(eq(healthMetrics.userId, userId), gte(healthMetrics.recordedAt, thirtyDaysAgo))),
        db.select({ count: sql<number>`count(*)::int` })
          .from(healthLogs)
          .where(and(eq(healthLogs.userId, userId), gte(healthLogs.loggedAt, sevenDaysAgo))),
        db.select({ count: sql<number>`count(*)::int` })
          .from(healthMedications)
          .where(and(eq(healthMedications.userId, userId), eq(healthMedications.isActive, true))),
        db.select({ count: sql<number>`count(*)::int` })
          .from(healthAppointments)
          .where(and(eq(healthAppointments.userId, userId), eq(healthAppointments.status, "SCHEDULED" as any), gte(healthAppointments.appointmentDate, today))),
        db.select({ count: sql<number>`count(*)::int`, caloriesBurned: sql<string>`COALESCE(sum(${healthActivities.caloriesBurned}), 0)` })
          .from(healthActivities)
          .where(and(eq(healthActivities.userId, userId), gte(healthActivities.performedAt, sevenDaysAgo))),
        db.select({ count: sql<number>`count(*)::int` })
          .from(healthDeviceSyncs)
          .where(and(eq(healthDeviceSyncs.userId, userId), eq(healthDeviceSyncs.isConnected, true))),
        db.select({ count: sql<number>`count(*)::int` })
          .from(healthDocuments)
          .where(eq(healthDocuments.userId, userId)),
        db.select()
          .from(healthMetrics)
          .where(eq(healthMetrics.userId, userId))
          .orderBy(desc(healthMetrics.recordedAt))
          .limit(50),
      ]);

      const metricsByType = recentMetrics.reduce((acc: Record<string, { value: string; unit: string; recordedAt: Date }[]>, m) => {
        if (!acc[m.metricType]) acc[m.metricType] = [];
        acc[m.metricType].push({ value: m.value, unit: m.unit, recordedAt: m.recordedAt });
        return acc;
      }, {});

      return {
        metricsRecorded30d: totalMetrics[0].count,
        logsThisWeek: recentLogs[0].count,
        activeMedications: activeMedications[0].count,
        upcomingAppointments: upcomingAppointments[0].count,
        activitiesThisWeek: totalActivities[0].count,
        caloriesBurnedThisWeek: totalActivities[0].caloriesBurned,
        connectedDevices: connectedDevices[0].count,
        totalDocuments: totalDocuments[0].count,
        recentMetrics: metricsByType,
      };
    },
  };
}
