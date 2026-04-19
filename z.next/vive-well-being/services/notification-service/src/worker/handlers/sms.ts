import { logger } from "../../lib/logger.js";

export interface SmsPayload {
  to: string;
  body: string;
}

export async function sendSms(payload: SmsPayload): Promise<void> {
  // TODO: Integrate with an SMS provider (Twilio, AWS SNS, etc.)
  logger.warn({ to: payload.to }, "SMS handler is a stub — no message sent");
}
