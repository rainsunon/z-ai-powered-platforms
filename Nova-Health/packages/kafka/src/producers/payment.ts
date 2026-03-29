import { KafkaClient } from '../client';
import { PaymentEvent, PaymentEventType } from '../types';

/**
 * Payment Producer
 * Handles producing payment-related events to Kafka
 */
export class PaymentProducer {
  private client: KafkaClient;
  private topic: string;

  constructor(client: KafkaClient, topic: string = 'payment-events') {
    this.client = client;
    this.topic = topic;
  }

  /**
   * Produce a payment event
   */
  async produceEvent(event: PaymentEvent): Promise<void> {
    const message = {
      key: event.userId,
      value: JSON.stringify(event),
      headers: {
        'event-type': event.type,
        'user-id': event.userId,
        'payment-id': event.data.paymentId,
        'timestamp': event.data.timestamp,
      },
    };

    await this.client.produce({
      topic: this.topic,
      messages: [message],
    });
  }

  /**
   * Produce payment initiated event
   */
  async producePaymentInitiated(
    userId: string,
    paymentId: string,
    paymentMethodId: string,
    amount: number,
    currency: string = 'usd',
    metadata?: Record<string, any>
  ): Promise<void> {
    const event: PaymentEvent = {
      type: 'payment.initiated',
      userId,
      data: {
        paymentId,
        paymentMethodId,
        amount,
        currency,
        status: 'initiated',
        metadata,
        timestamp: new Date().toISOString(),
      },
    };

    await this.produceEvent(event);
  }

  /**
   * Produce payment processing event
   */
  async producePaymentProcessing(
    userId: string,
    paymentId: string,
    paymentMethodId: string,
    amount: number,
    currency: string = 'usd',
    metadata?: Record<string, any>
  ): Promise<void> {
    const event: PaymentEvent = {
      type: 'payment.processing',
      userId,
      data: {
        paymentId,
        paymentMethodId,
        amount,
        currency,
        status: 'processing',
        metadata,
        timestamp: new Date().toISOString(),
      },
    };

    await this.produceEvent(event);
  }

  /**
   * Produce payment completed event
   */
  async producePaymentCompleted(
    userId: string,
    paymentId: string,
    paymentMethodId: string,
    amount: number,
    currency: string = 'usd',
    metadata?: Record<string, any>
  ): Promise<void> {
    const event: PaymentEvent = {
      type: 'payment.completed',
      userId,
      data: {
        paymentId,
        paymentMethodId,
        amount,
        currency,
        status: 'completed',
        metadata,
        timestamp: new Date().toISOString(),
      },
    };

    await this.produceEvent(event);
  }

  /**
   * Produce payment refunded event
   */
  async producePaymentRefunded(
    userId: string,
    paymentId: string,
    paymentMethodId: string,
    amount: number,
    currency: string = 'usd',
    metadata?: Record<string, any>
  ): Promise<void> {
    const event: PaymentEvent = {
      type: 'payment.refunded',
      userId,
      data: {
        paymentId,
        paymentMethodId,
        amount,
        currency,
        status: 'refunded',
        metadata,
        timestamp: new Date().toISOString(),
      },
    };

    await this.produceEvent(event);
  }

  /**
   * Produce payment chargeback event
   */
  async producePaymentChargeback(
    userId: string,
    paymentId: string,
    paymentMethodId: string,
    amount: number,
    currency: string = 'usd',
    metadata?: Record<string, any>
  ): Promise<void> {
    const event: PaymentEvent = {
      type: 'payment.chargeback',
      userId,
      data: {
        paymentId,
        paymentMethodId,
        amount,
        currency,
        status: 'chargeback',
        metadata,
        timestamp: new Date().toISOString(),
      },
    };

    await this.produceEvent(event);
  }
}

/**
 * Create a payment producer instance
 */
export function createPaymentProducer(
  client: KafkaClient,
  topic?: string
): PaymentProducer {
  return new PaymentProducer(client, topic);
}
