import { KafkaClient } from '../client';
import { SubscriptionEvent, SubscriptionEventType } from '../types';

/**
 * Subscription Producer
 * Handles producing subscription-related events to Kafka
 */
export class SubscriptionProducer {
  private client: KafkaClient;
  private topic: string;

  constructor(client: KafkaClient, topic: string = 'subscription-events') {
    this.client = client;
    this.topic = topic;
  }

  /**
   * Produce a subscription event
   */
  async produceEvent(event: SubscriptionEvent): Promise<void> {
    const message = {
      key: event.userId,
      value: JSON.stringify(event),
      headers: {
        'event-type': event.type,
        'user-id': event.userId,
        'subscription-id': event.data.subscriptionId,
        'timestamp': event.data.timestamp,
      },
    };

    await this.client.produce({
      topic: this.topic,
      messages: [message],
    });
  }

  /**
   * Produce subscription created event
   */
  async produceSubscriptionCreated(
    userId: string,
    subscriptionId: string,
    planId: string,
    startDate: string,
    endDate?: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    const event: SubscriptionEvent = {
      type: 'subscription.created',
      userId,
      data: {
        subscriptionId,
        planId,
        status: 'active',
        startDate,
        endDate,
        metadata,
        timestamp: new Date().toISOString(),
      },
    };

    await this.produceEvent(event);
  }

  /**
   * Produce subscription upgraded event
   */
  async produceSubscriptionUpgraded(
    userId: string,
    subscriptionId: string,
    planId: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    const event: SubscriptionEvent = {
      type: 'subscription.upgraded',
      userId,
      data: {
        subscriptionId,
        planId,
        status: 'active',
        startDate: new Date().toISOString(),
        metadata,
        timestamp: new Date().toISOString(),
      },
    };

    await this.produceEvent(event);
  }

  /**
   * Produce subscription downgraded event
   */
  async produceSubscriptionDowngraded(
    userId: string,
    subscriptionId: string,
    planId: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    const event: SubscriptionEvent = {
      type: 'subscription.downgraded',
      userId,
      data: {
        subscriptionId,
        planId,
        status: 'active',
        startDate: new Date().toISOString(),
        metadata,
        timestamp: new Date().toISOString(),
      },
    };

    await this.produceEvent(event);
  }

  /**
   * Produce subscription paused event
   */
  async produceSubscriptionPaused(
    userId: string,
    subscriptionId: string,
    planId: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    const event: SubscriptionEvent = {
      type: 'subscription.paused',
      userId,
      data: {
        subscriptionId,
        planId,
        status: 'paused',
        startDate: new Date().toISOString(),
        metadata,
        timestamp: new Date().toISOString(),
      },
    };

    await this.produceEvent(event);
  }

  /**
   * Produce subscription resumed event
   */
  async produceSubscriptionResumed(
    userId: string,
    subscriptionId: string,
    planId: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    const event: SubscriptionEvent = {
      type: 'subscription.resumed',
      userId,
      data: {
        subscriptionId,
        planId,
        status: 'active',
        startDate: new Date().toISOString(),
        metadata,
        timestamp: new Date().toISOString(),
      },
    };

    await this.produceEvent(event);
  }

  /**
   * Produce subscription expired event
   */
  async produceSubscriptionExpired(
    userId: string,
    subscriptionId: string,
    planId: string,
    endDate: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    const event: SubscriptionEvent = {
      type: 'subscription.expired',
      userId,
      data: {
        subscriptionId,
        planId,
        status: 'expired',
        startDate: new Date().toISOString(),
        endDate,
        metadata,
        timestamp: new Date().toISOString(),
      },
    };

    await this.produceEvent(event);
  }
}

/**
 * Create a subscription producer instance
 */
export function createSubscriptionProducer(
  client: KafkaClient,
  topic?: string
): SubscriptionProducer {
  return new SubscriptionProducer(client, topic);
}
