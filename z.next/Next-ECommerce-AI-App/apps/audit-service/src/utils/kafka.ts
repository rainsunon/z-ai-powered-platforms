import { createKafkaClient, createProducer, createConsumer } from "@repo/kafka";

const kafkaClient = createKafkaClient("audit-service");

export const producer = createProducer(kafkaClient);
export const consumer = createConsumer(kafkaClient, "audit-group");
