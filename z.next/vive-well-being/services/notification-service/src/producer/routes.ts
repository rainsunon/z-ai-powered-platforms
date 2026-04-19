import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { events, notifications } from "@vive/notification-db/schema";
import { publishToExchange, ROUTING_KEY } from "../rabbitmq/client.js";
import { db } from "../db.js";
import { logger } from "../lib/logger.js";

// --- Schemas ---

const publishEventSchema = z.object({
  event_id: z.string().min(1),
  event_type: z.string().min(1),
  user_id: z.string().min(1),
  payload: z.object({
    subject: z.string().optional(),
    body: z.string(),
    metadata: z.record(z.unknown()).optional(),
  }),
});

// --- Routes ---

export const producerRoutes = new Hono()

  // POST /api/v1/events — publish an event to the queue
  .post("/events", zValidator("json", publishEventSchema), async (c) => {
    const body = c.req.valid("json");
    const log = logger.child({ eventId: body.event_id });

    // Idempotency check — reject duplicate event_id
    const [existing] = await db
      .select({ id: events.id })
      .from(events)
      .where(eq(events.eventId, body.event_id))
      .limit(1);

    if (existing) {
      log.warn("Duplicate event_id rejected");
      return c.json(
        { success: false, message: "Duplicate event_id, already received" },
        409
      );
    }

    // Persist event as PENDING
    const [record] = await db
      .insert(events)
      .values({
        eventId: body.event_id,
        eventType: body.event_type,
        payload: { ...body.payload, user_id: body.user_id },
        status: "PENDING",
      })
      .returning();

    // Publish to RabbitMQ
    await publishToExchange(ROUTING_KEY, {
      id: record.id,
      event_id: body.event_id,
      event_type: body.event_type,
      user_id: body.user_id,
      payload: body.payload,
    });

    log.info({ id: record.id }, "Event accepted and queued");

    return c.json(
      { success: true, message: "Event accepted and queued", id: record.id },
      202
    );
  })

  // GET /api/v1/notifications/:id — fetch notification by id
  .get("/notifications/:id", async (c) => {
    const id = c.req.param("id");

    const [record] = await db
      .select()
      .from(notifications)
      .where(eq(notifications.id, id))
      .limit(1);

    if (!record) {
      return c.json({ error: "Notification not found" }, 404);
    }

    return c.json(record);
  });
