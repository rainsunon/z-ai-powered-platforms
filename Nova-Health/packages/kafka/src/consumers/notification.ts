import { KafkaClient, MessageHandler } from '../client';
import { NotificationEvent } from '../types';

/**
 * Notification Consumer
 * Handles consuming notification-related events from Kafka
 */
export class NotificationConsumer {
  private client: KafkaClient;
  private topic: string;
  private groupId: string;

  constructor(
    client: KafkaClient,
    groupId: string = 'notification-consumer-group',
    topic: string = 'notification-events'
  ) {
    this.client = client;
    this.topic = topic;
    this.groupId = groupId;
  }

  /**
   * Start consuming notification events
   */
  async consume(handler: NotificationEventHandler): Promise<void> {
    const messageHandler: MessageHandler = async (payload) => {
      try {
        const message = payload.message.value?.toString();
        if (!message) {
          console.error('Received empty message');
          return;
        }

        const event: NotificationEvent = JSON.parse(message);
        await handler(event);
      } catch (error) {
        console.error('Error processing notification event:', error);
        throw error;
      }
    };

    await this.client.consume(
      {
        groupId: this.groupId,
        topics: [this.topic],
        fromBeginning: false,
      },
      messageHandler
    );
  }

  /**
   * Stop consuming notification events
   */
  async stop(): Promise<void> {
    await this.client.disconnect();
  }
}

/**
 * Notification event handler type
 */
export type NotificationEventHandler = (event: NotificationEvent) => Promise<void> | void;

/**
 * Create a notification consumer instance
 */
export function createNotificationConsumer(
  client: KafkaClient,
  groupId?: string,
  topic?: string
): NotificationConsumer {
  return new NotificationConsumer(client, groupId, topic);
}
