import { Kafka, Producer, Consumer, EachMessagePayload } from 'kafkajs';

/**
 * Kafka configuration interface
 */
export interface KafkaConfig {
  brokers: string[];
  clientId?: string;
  ssl?: boolean;
  sasl?: {
    mechanism: 'plain' | 'scram-sha-256' | 'scram-sha-512';
    username: string;
    password: string;
  };
}

/**
 * Producer configuration interface
 */
export interface ProducerConfig {
  topic: string;
  messages: Array<{
    key?: string;
    value: string;
    headers?: Record<string, string>;
    partition?: number;
  }>;
}

/**
 * Consumer configuration interface
 */
export interface ConsumerConfig {
  groupId: string;
  topics: string[];
  fromBeginning?: boolean;
}

/**
 * Message handler type for consumers
 */
export type MessageHandler = (payload: EachMessagePayload) => Promise<void> | void;

/**
 * Billing event types
 */
export type BillingEventType = 
  | 'payment.created'
  | 'payment.succeeded'
  | 'payment.failed'
  | 'invoice.generated'
  | 'invoice.paid'
  | 'subscription.created'
  | 'subscription.updated'
  | 'subscription.cancelled'
  | 'subscription.renewed';

/**
 * Billing event payload
 */
export interface BillingEvent {
  type: BillingEventType;
  userId: string;
  data: {
    paymentId?: string;
    invoiceId?: string;
    subscriptionId?: string;
    amount?: number;
    currency?: string;
    status?: string;
    planId?: string;
    metadata?: Record<string, any>;
    timestamp: string;
  };
}

/**
 * Payment event types
 */
export type PaymentEventType = 
  | 'payment.initiated'
  | 'payment.processing'
  | 'payment.completed'
  | 'payment.refunded'
  | 'payment.chargeback';

/**
 * Payment event payload
 */
export interface PaymentEvent {
  type: PaymentEventType;
  userId: string;
  data: {
    paymentId: string;
    paymentMethodId: string;
    amount: number;
    currency: string;
    status: string;
    metadata?: Record<string, any>;
    timestamp: string;
  };
}

/**
 * Subscription event types
 */
export type SubscriptionEventType = 
  | 'subscription.created'
  | 'subscription.upgraded'
  | 'subscription.downgraded'
  | 'subscription.paused'
  | 'subscription.resumed'
  | 'subscription.expired';

/**
 * Subscription event payload
 */
export interface SubscriptionEvent {
  type: SubscriptionEventType;
  userId: string;
  data: {
    subscriptionId: string;
    planId: string;
    status: string;
    startDate: string;
    endDate?: string;
    metadata?: Record<string, any>;
    timestamp: string;
  };
}

/**
 * Notification event types
 */
export type NotificationEventType = 
  | 'email.sent'
  | 'email.failed'
  | 'sms.sent'
  | 'sms.failed'
  | 'push.sent'
  | 'push.failed'
  | 'notification.created'
  | 'notification.read';

/**
 * Notification event payload
 */
export interface NotificationEvent {
  type: NotificationEventType;
  userId: string;
  data: {
    notificationId?: string;
    channel: 'email' | 'sms' | 'push';
    subject?: string;
    body: string;
    status?: string;
    metadata?: Record<string, any>;
    timestamp: string;
  };
}

/**
 * Kafka client interface
 */
export interface IKafkaClient {
  producer: Producer;
  consumer: Consumer;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  produce(config: ProducerConfig): Promise<void>;
  consume(config: ConsumerConfig, handler: MessageHandler): Promise<void>;
}
