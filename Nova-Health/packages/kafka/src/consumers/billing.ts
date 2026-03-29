import { KafkaClient, MessageHandler } from '../client';
import { BillingEvent } from '../types';

/**
 * Billing Consumer
 * Handles consuming billing-related events from Kafka
 */
export class BillingConsumer {
  private client: KafkaClient;
  private topic: string;
  private groupId: string;

  constructor(
    client: KafkaClient,
    groupId: string = 'billing-consumer-group',
    topic: string = 'billing-events'
  ) {
    this.client = client;
    this.topic = topic;
    this.groupId = groupId;
  }

  /**
   * Start consuming billing events
   */
  async consume(handler: BillingEventHandler): Promise<void> {
    const messageHandler: MessageHandler = async (payload) => {
      try {
        const message = payload.message.value?.toString();
        if (!message) {
          console.error('Received empty message');
          return;
        }

        const event: BillingEvent = JSON.parse(message);
        await handler(event);
      } catch (error) {
        console.error('Error processing billing event:', error);
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
   * Stop consuming billing events
   */
  async stop(): Promise<void> {
    await this.client.disconnect();
  }
}

/**
 * Billing event handler type
 */
export type BillingEventHandler = (event: BillingEvent) => Promise<void> | void;

/**
 * Create a billing consumer instance
 */
export function createBillingConsumer(
  client: KafkaClient,
  groupId?: string,
  topic?: string
): BillingConsumer {
  return new BillingConsumer(client, groupId, topic);
}
