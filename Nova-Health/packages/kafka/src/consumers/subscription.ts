import { KafkaClient, MessageHandler } from '../client';
import { SubscriptionEvent } from '../types';

/**
 * Subscription Consumer
 * Handles consuming subscription-related events from Kafka
 */
export class SubscriptionConsumer {
  private client: KafkaClient;
  private topic: string;
  private groupId: string;

  constructor(
    client: KafkaClient,
    groupId: string = 'subscription-consumer-group',
    topic: string = 'subscription-events'
  ) {
    this.client = client;
    this.topic = topic;
    this.groupId = groupId;
  }

  /**
   * Start consuming subscription events
   */
  async consume(handler: SubscriptionEventHandler): Promise<void> {
    const messageHandler: MessageHandler = async (payload) => {
      try {
        const message = payload.message.value?.toString();
        if (!message) {
          console.error('Received empty message');
          return;
        }

        const event: SubscriptionEvent = JSON.parse(message);
        await handler(event);
      } catch (error) {
        console.error('Error processing subscription event:', error);
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
   * Stop consuming subscription events
   */
  async stop(): Promise<void> {
    await this.client.disconnect();
  }
}

/**
 * Subscription event handler type
 */
export type SubscriptionEventHandler = (event: SubscriptionEvent) => Promise<void> | void;

/**
 * Create a subscription consumer instance
 */
export function createSubscriptionConsumer(
  client: KafkaClient,
  groupId?: string,
  topic?: string
): SubscriptionConsumer {
  return new SubscriptionConsumer(client, groupId, topic);
}
