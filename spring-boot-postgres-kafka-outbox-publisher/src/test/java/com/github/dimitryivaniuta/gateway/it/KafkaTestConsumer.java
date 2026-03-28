package com.github.dimitryivaniuta.gateway.it;

import java.time.Duration;
import java.util.*;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.common.serialization.StringDeserializer;

/**
 * Small helper to consume records from Kafka in integration tests.
 */
public final class KafkaTestConsumer implements AutoCloseable {

    private final KafkaConsumer<String, String> consumer;

    /**
     * Creates a new consumer subscribed to the given topic.
     *
     * @param bootstrapServers Kafka bootstrap servers
     * @param topic topic to subscribe
     */
    public KafkaTestConsumer(String bootstrapServers, String topic) {
        Properties props = new Properties();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "it-" + UUID.randomUUID());
        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, "false");
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());

        this.consumer = new KafkaConsumer<>(props);
        this.consumer.subscribe(Collections.singletonList(topic));
    }

    /**
     * Polls until {@code expectedCount} records are received or timeout is reached.
     *
     * @param expectedCount expected number of records
     * @param timeout maximum duration
     * @return list of consumed records (may be smaller if timeout reached)
     */
    public List<org.apache.kafka.clients.consumer.ConsumerRecord<String, String>> pollFor(int expectedCount, Duration timeout) {
        long deadline = System.currentTimeMillis() + timeout.toMillis();
        List<org.apache.kafka.clients.consumer.ConsumerRecord<String, String>> out = new ArrayList<>();

        while (System.currentTimeMillis() < deadline && out.size() < expectedCount) {
            var records = consumer.poll(Duration.ofMillis(200));
            records.forEach(out::add);
        }
        return out;
    }

    @Override
    public void close() {
        consumer.close();
    }
}
