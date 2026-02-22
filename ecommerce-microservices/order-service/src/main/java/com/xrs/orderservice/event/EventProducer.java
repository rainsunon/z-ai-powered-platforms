package com.xrs.orderservice.event;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import reactor.kafka.sender.KafkaSender;
import reactor.kafka.sender.SenderRecord;

/**
 * Kafka event producer for publishing domain events
 * Uses reactor-kafka for non-blocking reactive event publishing
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class EventProducer {
    
    private final KafkaSender<String, String> sender;

    /**
     * Send a message to specified Kafka topic
     * 
     * @param topic The Kafka topic name
     * @param message The message payload (typically JSON)
     * @return Mono<String> indicating success
     */
    public Mono<String> send(String topic, String message) {
        log.debug("Publishing event to topic: {} with message: {}", topic, message);
        
        return sender
                .send(Mono.just(SenderRecord.create(new ProducerRecord<>(topic, message), message)))
                .then()
                .thenReturn("OK")
                .doOnSuccess(result -> log.info("Successfully published event to topic: {}", topic))
                .doOnError(error -> log.error("Failed to publish event to topic: {}, error: {}", topic, error.getMessage()));
    }
    
    /**
     * Send a message with a specific key to maintain ordering
     * 
     * @param topic The Kafka topic name
     * @param key The message key (e.g., orderId for ordering)
     * @param message The message payload
     * @return Mono<String> indicating success
     */
    public Mono<String> send(String topic, String key, String message) {
        log.debug("Publishing event to topic: {} with key: {} and message: {}", topic, key, message);
        
        return sender
                .send(Mono.just(SenderRecord.create(new ProducerRecord<>(topic, key, message), message)))
                .then()
                .thenReturn("OK")
                .doOnSuccess(result -> log.info("Successfully published event to topic: {} with key: {}", topic, key))
                .doOnError(error -> log.error("Failed to publish event to topic: {}, error: {}", topic, error.getMessage()));
    }
}
