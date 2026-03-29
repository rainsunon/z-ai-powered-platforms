# @nova-health/kafka

A shared Kafka library for Nova Health microservices using kafkajs.

## Installation

```bash
npm install @nova-health/kafka
```

## Configuration

Set the following environment variables:

```bash
KAFKA_BROKERS=localhost:9092
KAFKA_SSL=false
```

## Usage

### Basic Setup

```typescript
import { getKafkaClient } from '@nova-health/kafka';

// Get singleton Kafka client instance
const kafkaClient = getKafkaClient();

// Connect to Kafka
await kafkaClient.connect();
```

### Custom Configuration

```typescript
import { createKafkaClient } from '@nova-health/kafka';

const kafkaClient = createKafkaClient({
  brokers: ['localhost:9092', 'localhost:9093'],
  clientId: 'my-service',
  ssl: false,
});
```

## Producers

### Billing Producer

```typescript
import { getKafkaClient, createBillingProducer } from '@nova-health/kafka';

const client = getKafkaClient();
await client.connect();

const billingProducer = createBillingProducer(client);

// Produce payment succeeded event
await billingProducer.producePaymentSucceeded(
  'user-123',
  'payment-456',
  99.99,
  'usd'
);

// Produce subscription created event
await billingProducer.produceSubscriptionCreated(
  'user-123',
  'sub-789',
  'premium-plan'
);
```

### Payment Producer

```typescript
import { getKafkaClient, createPaymentProducer } from '@nova-health/kafka';

const client = getKafkaClient();
await client.connect();

const paymentProducer = createPaymentProducer(client);

// Produce payment initiated event
await paymentProducer.producePaymentInitiated(
  'user-123',
  'payment-456',
  'pm-789',
  99.99,
  'usd'
);

// Produce payment completed event
await paymentProducer.producePaymentCompleted(
  'user-123',
  'payment-456',
  'pm-789',
  99.99,
  'usd'
);
```

### Subscription Producer

```typescript
import { getKafkaClient, createSubscriptionProducer } from '@nova-health/kafka';

const client = getKafkaClient();
await client.connect();

const subscriptionProducer = createSubscriptionProducer(client);

// Produce subscription created event
await subscriptionProducer.produceSubscriptionCreated(
  'user-123',
  'sub-789',
  'premium-plan',
  new Date().toISOString(),
  new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
);

// Produce subscription upgraded event
await subscriptionProducer.produceSubscriptionUpgraded(
  'user-123',
  'sub-789',
  'enterprise-plan'
);
```

### Notification Producer

```typescript
import { getKafkaClient, createNotificationProducer } from '@nova-health/kafka';

const client = getKafkaClient();
await client.connect();

const notificationProducer = createNotificationProducer(client);

// Produce email sent event
await notificationProducer.produceEmailSent(
  'user-123',
  'notif-456',
  'Welcome to Nova Health',
  'Thank you for signing up!'
);

// Produce SMS sent event
await notificationProducer.produceSmsSent(
  'user-123',
  'notif-789',
  'Your appointment is confirmed'
);

// Produce push notification sent event
await notificationProducer.producePushSent(
  'user-123',
  'notif-012',
  'New health alert available'
);
```

## Consumers

### Billing Consumer

```typescript
import { getKafkaClient, createBillingConsumer, type BillingEventHandler } from '@nova-health/kafka';

const client = getKafkaClient();
await client.connect();

const billingConsumer = createBillingConsumer(client);

const handler: BillingEventHandler = async (event) => {
  console.log('Received billing event:', event);
  
  switch (event.type) {
    case 'payment.succeeded':
      // Handle payment succeeded
      break;
    case 'subscription.created':
      // Handle subscription created
      break;
    // ... handle other event types
  }
};

await billingConsumer.consume(handler);
```

### Payment Consumer

```typescript
import { getKafkaClient, createPaymentConsumer, type PaymentEventHandler } from '@nova-health/kafka';

const client = getKafkaClient();
await client.connect();

const paymentConsumer = createPaymentConsumer(client);

const handler: PaymentEventHandler = async (event) => {
  console.log('Received payment event:', event);
  
  switch (event.type) {
    case 'payment.initiated':
      // Handle payment initiated
      break;
    case 'payment.completed':
      // Handle payment completed
      break;
    // ... handle other event types
  }
};

await paymentConsumer.consume(handler);
```

### Subscription Consumer

```typescript
import { getKafkaClient, createSubscriptionConsumer, type SubscriptionEventHandler } from '@nova-health/kafka';

const client = getKafkaClient();
await client.connect();

const subscriptionConsumer = createSubscriptionConsumer(client);

const handler: SubscriptionEventHandler = async (event) => {
  console.log('Received subscription event:', event);
  
  switch (event.type) {
    case 'subscription.created':
      // Handle subscription created
      break;
    case 'subscription.upgraded':
      // Handle subscription upgraded
      break;
    // ... handle other event types
  }
};

await subscriptionConsumer.consume(handler);
```

### Notification Consumer

```typescript
import { getKafkaClient, createNotificationConsumer, type NotificationEventHandler } from '@nova-health/kafka';

const client = getKafkaClient();
await client.connect();

const notificationConsumer = createNotificationConsumer(client);

const handler: NotificationEventHandler = async (event) => {
  console.log('Received notification event:', event);
  
  switch (event.type) {
    case 'email.sent':
      // Handle email sent
      break;
    case 'sms.sent':
      // Handle SMS sent
      break;
    case 'push.sent':
      // Handle push notification sent
      break;
    // ... handle other event types
  }
};

await notificationConsumer.consume(handler);
```

## Event Types

### Billing Events

- `payment.created` - Payment created
- `payment.succeeded` - Payment succeeded
- `payment.failed` - Payment failed
- `invoice.generated` - Invoice generated
- `invoice.paid` - Invoice paid
- `subscription.created` - Subscription created
- `subscription.updated` - Subscription updated
- `subscription.cancelled` - Subscription cancelled
- `subscription.renewed` - Subscription renewed

### Payment Events

- `payment.initiated` - Payment initiated
- `payment.processing` - Payment processing
- `payment.completed` - Payment completed
- `payment.refunded` - Payment refunded
- `payment.chargeback` - Payment chargeback

### Subscription Events

- `subscription.created` - Subscription created
- `subscription.upgraded` - Subscription upgraded
- `subscription.downgraded` - Subscription downgraded
- `subscription.paused` - Subscription paused
- `subscription.resumed` - Subscription resumed
- `subscription.expired` - Subscription expired

### Notification Events

- `email.sent` - Email sent
- `email.failed` - Email failed
- `sms.sent` - SMS sent
- `sms.failed` - SMS failed
- `push.sent` - Push notification sent
- `push.failed` - Push notification failed
- `notification.created` - Notification created
- `notification.read` - Notification read

## Error Handling

All producers and consumers include error handling. Errors are logged to console and re-thrown for proper error management in your application.

## Cleanup

Always disconnect from Kafka when shutting down your application:

```typescript
await kafkaClient.disconnect();
```

## License

MIT
