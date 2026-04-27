import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { authMiddleware } from "../middleware/auth";
import { prisma } from "../lib/prisma";
import { createApp } from "../lib/hono";

const settings = createApp();

settings.get("/", authMiddleware, async (c) => {
  const userId = c.get("userId");

  let userSettings = await prisma.settings.findUnique({
    where: { userId },
  });

  if (!userSettings) {
    userSettings = await prisma.settings.create({
      data: {
        userId,
        business: { name: "", address: "", phone: "", email: "", logo: "" },
        accounting: { fiscalYear: "calendar", currency: "USD", taxId: "" },
        taxes: { defaultRate: 0, taxInclusive: false },
        payments: { defaultTerms: "Net 30" },
        notifications: { email: true, overdue: true, reminders: true },
        branding: { theme: "light", primaryColor: "#0077c5" },
        preferences: { dateFormat: "YYYY-MM-DD", currency: "USD" },
      },
    });
  }

  return c.json(userSettings);
});

const UpdateSettingsSchema = z.object({
  business: z.any().optional(),
  accounting: z.any().optional(),
  taxes: z.any().optional(),
  payments: z.any().optional(),
  notifications: z.any().optional(),
  branding: z.any().optional(),
  preferences: z.any().optional(),
  integrations: z.any().optional(),
});

settings.patch("/", authMiddleware, zValidator("json", UpdateSettingsSchema), async (c) => {
  const userId = c.get("userId");
  const data = c.req.valid("json");

  const updated = await prisma.settings.upsert({
    where: { userId },
    update: data,
    create: {
      userId,
      ...data,
    },
  });

  return c.json(updated);
});

export default settings;
