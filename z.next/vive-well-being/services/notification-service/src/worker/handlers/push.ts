import { logger } from "../../lib/logger.js";

export interface PushPayload {
  token: string;
  title: string;
  body: string;
}

export async function sendPush(payload: PushPayload): Promise<void> {
  // TODO: Integrate with a push provider (FCM, APNs, etc.)
  logger.warn({ token: payload.token }, "Push handler is a stub — no notification sent");
}
