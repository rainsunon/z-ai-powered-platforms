import type { ConsumeMessage } from "amqplib";
import { eq } from "drizzle-orm";
import { events, notifications, userPreferences } from "@vive/notification-db/schema";
import { db } from "../db.js";
import { getChannel, RETRY_QUEUE, DLQ } from "../rabbitmq/client.js";
import { env } from "../config/env.js";
import { checkRateLimit } from "./rate-limiter.js";
import { sendEmail } from "./handlers/email.js";
import { sendSms } from "./handlers/sms.js";
import { sendPush } from "./handlers/push.js";
import { logger } from "../lib/logger.js";

interface EventMessage {
  id: string;
  event_id: string;
  event_type: string;
  user_id: string;
  payload: {
    subject?: string;
    body: string;
    metadata?: Record<string, unknown>;
  };
}

// Maximum number of times a rate-limited message can be re-queued before it goes to DLQ
const MAX_RATE_LIMIT_BOUNCES = 10;

/**
 * Process a single message from the notifications queue.
 * Handles idempotency, user preferences, rate limiting,
 * channel dispatch, and retry/DLQ logic.
 */
export async function processMessage(msg: ConsumeMessage): Promise<void> {
  const channel = getChannel();
  const raw: EventMessage = JSON.parse(msg.content.toString());
  const retryCount = (msg.properties.headers?.["x-retry-count"] as number) ?? 0;
  const rateLimitBounces = (msg.properties.headers?.["x-rate-limit-bounces"] as number) ?? 0;

  const log = logger.child({ eventId: raw.event_id, userId: raw.user_id, retryCount });

  log.info("Processing event");

  try {
    // --- 1. Idempotency: skip if event already processed ---
    const [existing] = await db
      .select({ status: events.status })
      .from(events)
      .where(eq(events.eventId, raw.event_id))
      .limit(1);

    if (existing?.status === "PROCESSED") {
      log.info("Skipping duplicate event (already PROCESSED)");
      channel.ack(msg);
      return;
    }

    // Mark event as being processed
    await db
      .update(events)
      .set({ status: "RETRYING", retryCount, updatedAt: new Date() })
      .where(eq(events.eventId, raw.event_id));

    // --- 2. Load user preferences ---
    const [prefs] = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, raw.user_id))
      .limit(1);

    // Default: email only if no preference row exists
    const channels: Array<"EMAIL" | "SMS" | "PUSH"> = [];
    if (!prefs || prefs.emailEnabled) channels.push("EMAIL");
    if (prefs?.smsEnabled) channels.push("SMS");
    if (prefs?.pushEnabled) channels.push("PUSH");

    if (channels.length === 0) {
      log.info("No channels enabled for user, marking PROCESSED");
      await db
        .update(events)
        .set({ status: "PROCESSED", updatedAt: new Date() })
        .where(eq(events.eventId, raw.event_id));
      channel.ack(msg);
      return;
    }

    // --- 3. Rate limiting (with bounce cap) ---
    const allowed = await checkRateLimit(raw.user_id);
    if (!allowed) {
      if (rateLimitBounces >= MAX_RATE_LIMIT_BOUNCES) {
        log.error({ rateLimitBounces }, "Rate-limit bounce cap exceeded, sending to DLQ");
        channel.sendToQueue(DLQ, Buffer.from(JSON.stringify(raw)), {
          persistent: true,
          headers: {
            "x-retry-count": retryCount,
            "x-rate-limit-bounces": rateLimitBounces,
            "x-error": "Rate-limit bounce cap exceeded",
          },
        });
        await db
          .update(events)
          .set({ status: "FAILED", errorMessage: "Rate-limit bounce cap exceeded", updatedAt: new Date() })
          .where(eq(events.eventId, raw.event_id));
        channel.ack(msg);
        return;
      }

      log.warn({ rateLimitBounces }, "Rate limited, requeueing with backoff");
      channel.sendToQueue(
        RETRY_QUEUE,
        Buffer.from(JSON.stringify(raw)),
        {
          persistent: true,
          expiration: "10000", // wait 10s before retry
          headers: {
            "x-retry-count": retryCount,
            "x-rate-limit-bounces": rateLimitBounces + 1,
          },
        }
      );
      channel.ack(msg);
      return;
    }

    // --- 4. Dispatch to each channel (track per-channel success/failure) ---
    let hasFailure = false;

    for (const ch of channels) {
      try {
        const recipient = getRecipient(ch, prefs, raw);
        if (!recipient) {
          log.warn({ channel: ch }, "No recipient found, skipping channel");
          continue;
        }

        await dispatchNotification(ch, recipient, raw);

        // Write SENT notification record
        await db.insert(notifications).values({
          eventId: raw.event_id,
          userId: raw.user_id,
          channel: ch,
          status: "SENT",
          recipient,
          subject: raw.payload.subject ?? null,
          body: raw.payload.body,
          sentAt: new Date(),
        });

        log.info({ channel: ch, recipient }, "Notification sent");
      } catch (handlerErr) {
        hasFailure = true;
        const errMsg =
          handlerErr instanceof Error ? handlerErr.message : String(handlerErr);
        log.error({ channel: ch, error: errMsg }, "Channel handler failed");

        await db.insert(notifications).values({
          eventId: raw.event_id,
          userId: raw.user_id,
          channel: ch,
          status: "FAILED",
          recipient: getRecipient(ch, prefs, raw) ?? "unknown",
          subject: raw.payload.subject ?? null,
          body: raw.payload.body,
          errorMessage: errMsg,
          failedAt: new Date(),
        });
      }
    }

    // --- 5. Mark event status based on per-channel results ---
    if (hasFailure) {
      // Some channels failed — mark as FAILED so it can be retried or investigated
      if (retryCount < env.MAX_RETRIES) {
        const delay = Math.pow(2, retryCount) * 1000;
        log.warn({ delay }, "Partial delivery failure, retrying");
        channel.sendToQueue(
          RETRY_QUEUE,
          Buffer.from(JSON.stringify(raw)),
          {
            persistent: true,
            expiration: String(delay),
            headers: { "x-retry-count": retryCount + 1 },
          }
        );
        await db
          .update(events)
          .set({ status: "RETRYING", retryCount: retryCount + 1, updatedAt: new Date() })
          .where(eq(events.eventId, raw.event_id));
      } else {
        log.error("Partial delivery failure after max retries, sending to DLQ");
        channel.sendToQueue(DLQ, Buffer.from(JSON.stringify(raw)), {
          persistent: true,
          headers: {
            "x-retry-count": retryCount,
            "x-error": "Partial delivery: some channels failed after max retries",
          },
        });
        await db
          .update(events)
          .set({
            status: "FAILED",
            errorMessage: "Partial delivery: some channels failed after max retries",
            updatedAt: new Date(),
          })
          .where(eq(events.eventId, raw.event_id));
      }
    } else {
      await db
        .update(events)
        .set({ status: "PROCESSED", updatedAt: new Date() })
        .where(eq(events.eventId, raw.event_id));
      log.info("All channels delivered, event PROCESSED");
    }

    channel.ack(msg);
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    log.error({ error: errMsg }, "Processing failed (infrastructure error)");

    if (retryCount >= env.MAX_RETRIES) {
      // --- Send to DLQ ---
      log.error({ maxRetries: env.MAX_RETRIES }, "Max retries exceeded, sending to DLQ");
      channel.sendToQueue(DLQ, Buffer.from(JSON.stringify(raw)), {
        persistent: true,
        headers: { "x-retry-count": retryCount, "x-error": errMsg },
      });

      await db
        .update(events)
        .set({ status: "FAILED", errorMessage: errMsg, updatedAt: new Date() })
        .where(eq(events.eventId, raw.event_id));

      channel.ack(msg);
    } else {
      // --- Retry with exponential backoff ---
      const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s, …
      log.info({ delay, attempt: retryCount + 1 }, "Retrying with exponential backoff");

      channel.sendToQueue(
        RETRY_QUEUE,
        Buffer.from(JSON.stringify(raw)),
        {
          persistent: true,
          expiration: String(delay),
          headers: { "x-retry-count": retryCount + 1 },
        }
      );
      channel.ack(msg);
    }
  }
}

// --- Helpers ---

function getRecipient(
  ch: "EMAIL" | "SMS" | "PUSH",
  prefs: { emailAddress: string | null; phoneNumber: string | null; pushToken: string | null } | undefined,
  raw: EventMessage
): string | null {
  switch (ch) {
    case "EMAIL":
      return prefs?.emailAddress ?? (raw.payload.metadata?.email as string) ?? null;
    case "SMS":
      return prefs?.phoneNumber ?? null;
    case "PUSH":
      return prefs?.pushToken ?? null;
  }
}

async function dispatchNotification(
  ch: "EMAIL" | "SMS" | "PUSH",
  recipient: string,
  raw: EventMessage
): Promise<void> {
  switch (ch) {
    case "EMAIL":
      await sendEmail({
        to: recipient,
        subject: raw.payload.subject ?? "VIVE Well-Being Notification",
        body: raw.payload.body,
      });
      break;
    case "SMS":
      await sendSms({ to: recipient, body: raw.payload.body });
      break;
    case "PUSH":
      await sendPush({
        token: recipient,
        title: raw.payload.subject ?? "Notification",
        body: raw.payload.body,
      });
      break;
  }
}
