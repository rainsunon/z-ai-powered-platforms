import { createConsumer, createKafkaClient, createProducer } from "@repo/kafka";

const kafkaClient = createKafkaClient("inventory-service");

export const producer = createProducer(kafkaClient);
export const consumer = createConsumer(kafkaClient, "inventory-group");
