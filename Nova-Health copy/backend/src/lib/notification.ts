import { Kafka } from 'kafkajs';
import { env } from '../config/env';

const kafka = new Kafka({
  clientId: 'nova-health',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});

export const notificationProducer = kafka.producer();

export async function sendNotification(topic: string, message: object) {
  await notificationProducer.connect();
  await notificationProducer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
  await notificationProducer.disconnect();
}

// Example: sendNotification('email', { to: 'user@example.com', subject: 'Hello', body: 'Test' });import { producer } from '@/config/kafka';

export async function sendNotification(topic: string, message: object) {
  await producer.connect();
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
  await producer.disconnect();
}