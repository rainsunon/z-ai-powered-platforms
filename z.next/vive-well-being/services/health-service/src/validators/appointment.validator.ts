import { z } from "zod";

export const createAppointmentSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional().nullable(),
  providerName: z.string().max(255).optional().nullable(),
  location: z.string().max(500).optional().nullable(),
  appointmentDate: z.string().date(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/).optional().nullable(),
  status: z.enum(["SCHEDULED", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "NO_SHOW"]).optional().default("SCHEDULED"),
  reminderMinutesBefore: z.number().int().optional().default(30),
  notes: z.string().optional().nullable(),
});

export const updateAppointmentSchema = createAppointmentSchema.partial();

export const appointmentQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  status: z.enum(["SCHEDULED", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "NO_SHOW"]).optional(),
  date: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const batchCreateAppointmentSchema = z.object({
  dates: z.array(z.string().date()).min(1),
  appointment: createAppointmentSchema,
});
