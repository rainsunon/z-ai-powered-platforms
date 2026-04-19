import { Kafka, Producer, Consumer, EachMessagePayload } from 'kafkajs';
import {
  IKafkaClient,
  KafkaConfig,
  ProducerConfig,
  ConsumerConfig,
} from './types';

export type MessageHandler = (payload: EachMessagePayload) => Promise<void> | void;

/**
 * Kafka Client implementation
 * Provides a unified interface for producing and consuming messages
 */
export class KafkaClient implements IKafkaClient {
  private kafka: Kafka;
  public producer: Producer;
  public consumer: Consumer;
  private isConnected: boolean = false;

  constructor(config: KafkaConfig) {
    this.kafka = new Kafka({
      clientId: config.clientId || 'nova-health-kafka-client',
      brokers: config.brokers,
      ssl: config.ssl || false,
      sasl: config.sasl,
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({
      groupId: 'nova-health-consumer-group',
    });
  }

  /**
   * Connect to Kafka cluster
   */
  async connect(): Promise<void> {
    if (this.isConnected) {
      return;
    }

    await this.producer.connect();
    await this.consumer.connect();
    this.isConnected = true;
  }

  /**
   * Disconnect from Kafka cluster
   */
  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    await this.producer.disconnect();
    await this.consumer.disconnect();
    this.isConnected = false;
  }

  /**
   * Produce messages to a Kafka topic
   */
  async produce(config: ProducerConfig): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Kafka client is not connected. Call connect() first.');
    }

    await this.producer.send({
      topic: config.topic,
      messages: config.messages,
    });
  }

  /**
   * Consume messages from Kafka topics
   */
  async consume(config: ConsumerConfig, handler: MessageHandler): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Kafka client is not connected. Call connect() first.');
    }

    await this.consumer.subscribe({
      topics: config.topics,
      fromBeginning: config.fromBeginning || false,
    });

    await this.consumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        try {
          await handler(payload);
        } catch (error) {
          console.error('Error processing message:', error);
          throw error;
        }
      },
    });
  }

  /**
   * Create a new consumer with custom group ID
   */
  createConsumer(groupId: string): Consumer {
    return this.kafka.consumer({ groupId });
  }
}

/**
 * Create a Kafka client instance with default configuration
 */
export function createKafkaClient(config: Partial<KafkaConfig> = {}): KafkaClient {
  const defaultConfig: KafkaConfig = {
    brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'],
    clientId: config.clientId || 'nova-health-kafka-client',
    ssl: config.ssl || process.env.KAFKA_SSL === 'true',
    sasl: config.sasl,
  };

  return new KafkaClient(defaultConfig);
}

/**
 * Singleton Kafka client instance
 */
let kafkaClientInstance: KafkaClient | null = null;

/**
 * Get or create the singleton Kafka client instance
 */
export function getKafkaClient(): KafkaClient {
  if (!kafkaClientInstance) {
    kafkaClientInstance = createKafkaClient();
  }
  return kafkaClientInstance;
}
