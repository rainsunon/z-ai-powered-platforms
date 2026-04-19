import { z } from "zod";

export const createHealthMetricSchema = z.object({
  metricType: z.enum(["HEART_RATE", "BLOOD_PRESSURE", "BLOOD_SUGAR", "WEIGHT", "HEIGHT", "STEPS", "SLEEP", "CALORIES", "WATER_INTAKE", "EXERCISE", "OTHER"]),
  value: z.string().min(1),
  unit: z.string().min(1).max(50),
  notes: z.string().optional().nullable(),
  metadata: z.record(z.unknown()).optional().nullable(),
  recordedAt: z.string().optional(),
});

export const healthMetricQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
  metricType: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});
