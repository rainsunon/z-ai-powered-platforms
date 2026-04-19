
import { createKafkaClient, createProducer } from "@repo/kafka";

const kafkaClient = createKafkaClient("api-gateway");

export const producer = createProducer(kafkaClient);


