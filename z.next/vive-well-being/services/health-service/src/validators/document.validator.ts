import { z } from "zod";

export const createDocumentSchema = z.object({
  title: z.string().min(1).max(255),
  documentType: z.enum(["LAB_RESULT", "PRESCRIPTION", "IMAGING", "VISIT_SUMMARY", "REFERRAL", "VACCINATION", "OTHER"]),
  fileName: z.string().min(1).max(500),
  filePath: z.string().min(1).max(1000),
  fileSizeBytes: z.number().int().optional().nullable(),
  mimeType: z.string().max(100).optional().nullable(),
  description: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().default([]),
  issuedDate: z.string().date().optional().nullable(),
  providerName: z.string().max(255).optional().nullable(),
  isShared: z.boolean().optional().default(false),
  metadata: z.record(z.unknown()).optional().nullable(),
});

export const updateDocumentSchema = createDocumentSchema.partial();

export const documentQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  documentType: z.string().optional(),
  search: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});
