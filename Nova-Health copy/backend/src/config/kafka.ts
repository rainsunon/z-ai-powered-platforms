import { Kafka } from 'kafkajs';
import { Env } from './env';

export const kafka = new Kafka({
  clientId: 'nova-health-backend',
  brokers: [Env.KAFKA_BROKER || 'localhost:9092'],
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: 'notification-group' });