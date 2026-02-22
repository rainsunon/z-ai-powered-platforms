package com.xrs.inventoryservice.event;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import reactor.kafka.sender.KafkaSender;
import reactor.kafka.sender.SenderRecord;

@Component
@RequiredArgsConstructor
@Slf4j
public class InventoryEventProducer {

    private final KafkaSender<String, String> kafkaSender;

    public Mono<String> send(String topic, String message) {
        return kafkaSender.send(Mono.just(SenderRecord.create(new ProducerRecord<>(topic, message), message)))
                .doOnError(e -> log.error("Failed to send message to topic {}: {}", topic, e.getMessage()))
                .doOnNext(senderResult -> log.info("Successfully sent message to topic {} with offset {}",
                        topic, senderResult.recordMetadata().offset()))
                .then(Mono.just(message));
    }

    public Mono<String> send(String topic, String key, String message) {
        return kafkaSender.send(Mono.just(SenderRecord.create(new ProducerRecord<>(topic, key, message), message)))
                .doOnError(e -> log.error("Failed to send message with key {} to topic {}: {}", key, topic, e.getMessage()))
                .doOnNext(senderResult -> log.info("Successfully sent message with key {} to topic {} with offset {}",
                        key, topic, senderResult.recordMetadata().offset()))
                .then(Mono.just(message));
    }
}
