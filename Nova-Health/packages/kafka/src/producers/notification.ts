import { KafkaClient } from '../client';
import { NotificationEvent, NotificationEventType } from '../types';

/**
 * Notification Producer
 * Handles producing notification-related events to Kafka
 */
export class NotificationProducer {
  private client: KafkaClient;
  private topic: string;

  constructor(client: KafkaClient, topic: string = 'notification-events') {
    this.client = client;
    this.topic = topic;
  }

  /**
   * Produce a notification event
   */
  async produceEvent(event: NotificationEvent): Promise<void> {
    const message = {
      key: event.userId,
      value: JSON.stringify(event),
      headers: {
        'event-type': event.type,
        'user-id': event.userId,
        'channel': event.data.channel,
        'timestamp': event.data.timestamp,
      },
    };

    await this.client.produce({
      topic: this.topic,
      messages: [message],
    });
  }

  /**
   * Produce email sent event
   */
  async produceEmailSent(
    userId: string,
    notificationId: string,
    subject: string,
    body: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    const event: NotificationEvent = {
      type: 'email.sent',
      userId,
      data: {
        notificationId,
        channel: 'email',
        subject,
        body,
        status: 'sent',
        metadata,
        timestamp: new Date().toISOString(),
      },
    };

    await this.produceEvent(event);
  }

  /**
   * Produce email failed event
   */
  async produceEmailFailed(
    userId: string,
    notificationId: string,
    subject: string,
    body: string,
    reason: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    const event: NotificationEvent = {
      type: 'email.failed',
      userId,
      data: {
        notificationId,
        channel: 'email',
        subject,
        body,
        status: 'failed',
        metadata: {
          ...metadata,
          reason,
        },
        timestamp: new Date().toISOString(),
      },
    };

    await this.produceEvent(event);
  }

  /**
   * Produce SMS sent event
   */
  async produceSmsSent(
    userId: string,
    notificationId: string,
    body: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    const event: NotificationEvent = {
      type: 'sms.sent',
      userId,
      data: {
        notificationId,
        channel: 'sms',
        body,
        status: 'sent',
        metadata,
        timestamp: new Date().toISOString(),
      },
    };

    await this.produceEvent(event);
  }

  /**
   * Produce SMS failed event
   */
  async produceSmsFailed(
    userId: string,
    notificationId: string,
    body: string,
    reason: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    const event: NotificationEvent = {
      type: 'sms.failed',
      userId,
      data: {
        notificationId,
        channel: 'sms',
        body,
        status: 'failed',
        metadata: {
          ...metadata,
          reason,
        },
        timestamp: new Date().toISOString(),
      },
    };

    await this.produceEvent(event);
  }

  /**
   * Produce push notification sent event
   */
  async producePushSent(
    userId: string,
    notificationId: string,
    body: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    const event: NotificationEvent = {
      type: 'push.sent',
      userId,
      data: {
        notificationId,
        channel: 'push',
        body,
        status: 'sent',
        metadata,
        timestamp: new Date().toISOString(),
      },
    };

    await this.produceEvent(event);
  }

  /**
   * Produce push notification failed event
   */
  async producePushFailed(
    userId: string,
    notificationId: string,
    body: string,
    reason: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    const event: NotificationEvent = {
      type: 'push.failed',
      userId,
      data: {
        notificationId,
        channel: 'push',
        body,
        status: 'failed',
        metadata: {
          ...metadata,
          reason,
        },
        timestamp: new Date().toISOString(),
      },
    };

    await this.produceEvent(event);
  }

  /**
   * Produce notification created event
   */
  async produceNotificationCreated(
    userId: string,
    channel: 'email' | 'sms' | 'push',
    body: string,
    subject?: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    const event: NotificationEvent = {
      type: 'notification.created',
      userId,
      data: {
        channel,
        subject,
        body,
        metadata,
        timestamp: new Date().toISOString(),
      },
    };

    await this.produceEvent(event);
  }

  /**
   * Produce notification read event
   */
  async produceNotificationRead(
    userId: string,
    notificationId: string,
    channel: 'email' | 'sms' | 'push',
    metadata?: Record<string, any>
  ): Promise<void> {
    const event: NotificationEvent = {
      type: 'notification.read',
      userId,
      data: {
        notificationId,
        channel,
        body: '',
        status: 'read',
        metadata,
        timestamp: new Date().toISOString(),
      },
    };

    await this.produceEvent(event);
  }
}

/**
 * Create a notification producer instance
 */
export function createNotificationProducer(
  client: KafkaClient,
  topic?: string
): NotificationProducer {
  return new NotificationProducer(client, topic);
}
