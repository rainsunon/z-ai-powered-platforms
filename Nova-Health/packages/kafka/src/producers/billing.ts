import { KafkaClient } from '../client';
import { BillingEvent, BillingEventType } from '../types';

/**
 * Billing Producer
 * Handles producing billing-related events to Kafka
 */
export class BillingProducer {
  private client: KafkaClient;
  private topic: string;

  constructor(client: KafkaClient, topic: string = 'billing-events') {
    this.client = client;
    this.topic = topic;
  }

  /**
   * Produce a billing event
   */
  async produceEvent(event: BillingEvent): Promise<void> {
    const message = {
      key: event.userId,
      value: JSON.stringify(event),
      headers: {
        'event-type': event.type,
        'user-id': event.userId,
        'timestamp': event.data.timestamp,
      },
    };

    await this.client.produce({
      topic: this.topic,
      messages: [message],
    });
  }

  /**
   * Produce payment created event
   */
  async producePaymentCreated(
    userId: string,
    paymentId: string,
    amount: number,
    currency: string = 'usd'
  ): Promise<void> {
    const event: BillingEvent = {
      type: 'payment.created',
      userId,
      data: {
        paymentId,
        amount,
        currency,
        status: 'created',
        timestamp: new Date().toISOString(),
      },
    };

    await this.produceEvent(event);
  }

  /**
   * Produce payment succeeded event
   */
  async producePaymentSucceeded(
    userId: string,
    paymentId: string,
    amount: number,
    currency: string = 'usd'
  ): Promise<void> {
    const event: BillingEvent = {
      type: 'payment.succeeded',
      userId,
      data: {
        paymentId,
        amount,
        currency,
        status: 'succeeded',
        timestamp: new Date().toISOString(),
      },
    };

    await this.produceEvent(event);
  }

  /**
   * Produce payment failed event
   */
  async producePaymentFailed(
    userId: string,
    paymentId: string,
    amount: number,
    currency: string = 'usd',
    reason?: string
  ): Promise<void> {
    const event: BillingEvent = {
      type: 'payment.failed',
      userId,
      data: {
        paymentId,
        amount,
        currency,
        status: 'failed',
        timestamp: new Date().toISOString(),
      },
    };

    if (reason) {
      event.data.metadata = { reason };
    }

    await this.produceEvent(event);
  }

  /**
   * Produce invoice generated event
   */
  async produceInvoiceGenerated(
    userId: string,
    invoiceId: string,
    amount: number,
    currency: string = 'usd'
  ): Promise<void> {
    const event: BillingEvent = {
      type: 'invoice.generated',
      userId,
      data: {
        invoiceId,
        amount,
        currency,
        timestamp: new Date().toISOString(),
      },
    };

    await this.produceEvent(event);
  }

  /**
   * Produce invoice paid event
   */
  async produceInvoicePaid(
    userId: string,
    invoiceId: string,
    amount: number,
    currency: string = 'usd'
  ): Promise<void> {
    const event: BillingEvent = {
      type: 'invoice.paid',
      userId,
      data: {
        invoiceId,
        amount,
        currency,
        timestamp: new Date().toISOString(),
      },
    };

    await this.produceEvent(event);
  }

  /**
   * Produce subscription created event
   */
  async produceSubscriptionCreated(
    userId: string,
    subscriptionId: string,
    planId: string
  ): Promise<void> {
    const event: BillingEvent = {
      type: 'subscription.created',
      userId,
      data: {
        subscriptionId,
        planId,
        timestamp: new Date().toISOString(),
      },
    };

    await this.produceEvent(event);
  }

  /**
   * Produce subscription updated event
   */
  async produceSubscriptionUpdated(
    userId: string,
    subscriptionId: string,
    planId: string
  ): Promise<void> {
    const event: BillingEvent = {
      type: 'subscription.updated',
      userId,
      data: {
        subscriptionId,
        planId,
        timestamp: new Date().toISOString(),
      },
    };

    await this.produceEvent(event);
  }

  /**
   * Produce subscription cancelled event
   */
  async produceSubscriptionCancelled(
    userId: string,
    subscriptionId: string
  ): Promise<void> {
    const event: BillingEvent = {
      type: 'subscription.cancelled',
      userId,
      data: {
        subscriptionId,
        timestamp: new Date().toISOString(),
      },
    };

    await this.produceEvent(event);
  }

  /**
   * Produce subscription renewed event
   */
  async produceSubscriptionRenewed(
    userId: string,
    subscriptionId: string,
    planId: string
  ): Promise<void> {
    const event: BillingEvent = {
      type: 'subscription.renewed',
      userId,
      data: {
        subscriptionId,
        planId,
        timestamp: new Date().toISOString(),
      },
    };

    await this.produceEvent(event);
  }
}

/**
 * Create a billing producer instance
 */
export function createBillingProducer(
  client: KafkaClient,
  topic?: string
): BillingProducer {
  return new BillingProducer(client, topic);
}
