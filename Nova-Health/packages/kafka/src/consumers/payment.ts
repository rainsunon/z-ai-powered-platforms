import { KafkaClient, MessageHandler } from '../client';
import { PaymentEvent } from '../types';

/**
 * Payment Consumer
 * Handles consuming payment-related events from Kafka
 */
export class PaymentConsumer {
  private client: KafkaClient;
  private topic: string;
  private groupId: string;

  constructor(
    client: KafkaClient,
    groupId: string = 'payment-consumer-group',
    topic: string = 'payment-events'
  ) {
    this.client = client;
    this.topic = topic;
    this.groupId = groupId;
  }

  /**
   * Start consuming payment events
   */
  async consume(handler: PaymentEventHandler): Promise<void> {
    const messageHandler: MessageHandler = async (payload) => {
      try {
        const message = payload.message.value?.toString();
        if (!message) {
          console.error('Received empty message');
          return;
        }

        const event: PaymentEvent = JSON.parse(message);
        await handler(event);
      } catch (error) {
        console.error('Error processing payment event:', error);
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
   * Stop consuming payment events
   */
  async stop(): Promise<void> {
    await this.client.disconnect();
  }
}

/**
 * Payment event handler type
 */
export type PaymentEventHandler = (event: PaymentEvent) => Promise<void> | void;

/**
 * Create a payment consumer instance
 */
export function createPaymentConsumer(
  client: KafkaClient,
  groupId?: string,
  topic?: string
): PaymentConsumer {
  return new PaymentConsumer(client, groupId, topic);
}
