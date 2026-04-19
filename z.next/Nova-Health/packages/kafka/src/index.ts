// Core client
export { KafkaClient, createKafkaClient, getKafkaClient } from './client';
export type { MessageHandler } from './client';

// Types
export type {
  KafkaConfig,
  ProducerConfig,
  ConsumerConfig,
  BillingEvent,
  BillingEventType,
  PaymentEvent,
  PaymentEventType,
  SubscriptionEvent,
  SubscriptionEventType,
  NotificationEvent,
  NotificationEventType,
  IKafkaClient,
} from './types';

// Producers
export { BillingProducer, createBillingProducer } from './producers/billing';
export { PaymentProducer, createPaymentProducer } from './producers/payment';
export { SubscriptionProducer, createSubscriptionProducer } from './producers/subscription';
export { NotificationProducer, createNotificationProducer } from './producers/notification';

// Consumers
export { BillingConsumer, createBillingConsumer } from './consumers/billing';
export type { BillingEventHandler } from './consumers/billing';
export { PaymentConsumer, createPaymentConsumer } from './consumers/payment';
export type { PaymentEventHandler } from './consumers/payment';
export { SubscriptionConsumer, createSubscriptionConsumer } from './consumers/subscription';
export type { SubscriptionEventHandler } from './consumers/subscription';
export { NotificationConsumer, createNotificationConsumer } from './consumers/notification';
export type { NotificationEventHandler } from './consumers/notification';
