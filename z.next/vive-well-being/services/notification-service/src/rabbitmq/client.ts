import amqp, { type Channel, type Connection } from "amqplib";
import { env } from "../config/env.js";
import { logger } from "../lib/logger.js";

// Exchange & Queue names
export const EXCHANGE = "events_exchange";
export const QUEUE = "notifications_queue";
export const RETRY_QUEUE = "notifications_retry_queue";
export const DLQ = "notifications_dlq";
export const ROUTING_KEY = "notification.event";

let connection: Connection;
let channel: Channel;

export async function connectRabbitMQ(): Promise<Channel> {
  connection = await amqp.connect(env.RABBITMQ_URL);
  channel = await connection.createChannel();

  // Main exchange (topic)
  await channel.assertExchange(EXCHANGE, "topic", { durable: true });

  // DLQ - final resting place for exhausted messages
  await channel.assertQueue(DLQ, { durable: true });

  // Main queue - dead-letters go to DLQ
  await channel.assertQueue(QUEUE, {
    durable: true,
    arguments: {
      "x-dead-letter-exchange": "",
      "x-dead-letter-routing-key": DLQ,
    },
  });
  await channel.bindQueue(QUEUE, EXCHANGE, ROUTING_KEY);

  // Retry queue - messages sit here for per-message TTL, then route back to main queue
  // NOTE: No queue-level x-message-ttl — per-message expiration controls backoff correctly
  await channel.assertQueue(RETRY_QUEUE, {
    durable: true,
    arguments: {
      "x-dead-letter-exchange": "",
      "x-dead-letter-routing-key": QUEUE,
    },
  });

  logger.info("RabbitMQ connected and queues declared");
  return channel;
}

export function getChannel(): Channel {
  return channel;
}

export async function publishToExchange(
  routingKey: string,
  message: Record<string, unknown>
): Promise<void> {
  channel.publish(
    EXCHANGE,
    routingKey,
    Buffer.from(JSON.stringify(message)),
    { persistent: true }
  );
}

export async function disconnectRabbitMQ(): Promise<void> {
  await channel?.close();
  await connection?.close();
  logger.info("RabbitMQ disconnected");
}
