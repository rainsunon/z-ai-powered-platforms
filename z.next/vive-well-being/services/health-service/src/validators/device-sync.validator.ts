import { z } from "zod";

export const createDeviceSyncSchema = z.object({
  deviceName: z.string().min(1).max(255),
  deviceType: z.string().min(1).max(100),
  manufacturer: z.string().max(255).optional().nullable(),
  firmwareVersion: z.string().max(100).optional().nullable(),
  metadata: z.record(z.unknown()).optional().nullable(),
});

export const updateDeviceSyncSchema = z.object({
  syncStatus: z.enum(["SYNCED", "SYNCING", "ERROR", "DISCONNECTED"]).optional(),
  isConnected: z.boolean().optional(),
  batteryLevel: z.number().int().min(0).max(100).optional(),
  firmwareVersion: z.string().max(100).optional(),
  metadata: z.record(z.unknown()).optional(),
});
