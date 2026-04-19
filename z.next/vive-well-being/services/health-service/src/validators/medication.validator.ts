import { z } from "zod";

export const createMedicationSchema = z.object({
  name: z.string().min(1).max(255),
  dosage: z.string().min(1).max(100),
  frequency: z.enum(["DAILY", "TWICE_DAILY", "WEEKLY", "AS_NEEDED", "CUSTOM"]),
  startDate: z.string().date(),
  endDate: z.string().date().optional().nullable(),
  timeOfDay: z.array(z.string()).optional().default([]),
  notes: z.string().optional().nullable(),
  prescribedBy: z.string().max(255).optional().nullable(),
  refillsRemaining: z.number().int().optional().default(0),
  isActive: z.boolean().optional().default(true),
});

export const updateMedicationSchema = createMedicationSchema.partial();

export const medicationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  isActive: z.coerce.boolean().optional(),
  search: z.string().optional(),
});
