import { z } from "zod";

export const createHealthLogSchema = z.object({
  title: z.string().min(1).max(255),
  logType: z.enum(["HEART_RATE", "BLOOD_PRESSURE", "BLOOD_SUGAR", "WEIGHT", "HEIGHT", "STEPS", "SLEEP", "CALORIES", "WATER_INTAKE", "EXERCISE", "OTHER"]),
  value: z.string().optional().nullable(),
  unit: z.string().max(50).optional().nullable(),
  notes: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().default([]),
  mood: z.number().int().min(1).max(10).optional().nullable(),
  symptoms: z.array(z.string()).optional().default([]),
  loggedAt: z.string().optional().default(new Date().toISOString()),
});

export const updateHealthLogSchema = createHealthLogSchema.partial();

export const healthLogQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  logType: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  search: z.string().optional(),
});
