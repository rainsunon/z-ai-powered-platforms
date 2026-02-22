package com.xrs.productservice.event;

import com.xrs.commonlib.outbox.OutboxEvent;
import com.xrs.commonlib.outbox.OutboxPublisher;
import com.xrs.productservice.entity.ProductOutboxEvent;
import com.xrs.productservice.repository.ProductOutboxEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

/**
 * OutboxPublisher for product-service.
 * Extends the abstract OutboxPublisher from common-lib.
 * Publishes events to Kafka.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ProductOutboxPublisher extends OutboxPublisher {
    
    private final ProductOutboxEventRepository outboxRepository;
    private final KafkaTemplate<String, String> kafkaTemplate;
    
    public ProductOutboxPublisher(ProductOutboxEventRepository outboxRepository, 
                              KafkaTemplate<String, String> kafkaTemplate) {
        super(outboxRepository);
        this.kafkaTemplate = kafkaTemplate;
    }
    
    @Override
    protected Mono<Void> publishToBroker(String topic, String key, String payload) {
        log.debug("Publishing event to topic: {}, key: {}", topic, key);
        
        return kafkaTemplate.send(topic, key, payload)
                .doOnSuccess(result -> {
                    log.info("Successfully published event to topic: {}, partition: {}, offset: {}", 
                            topic, result.getRecordMetadata().partition(), result.getRecordMetadata().offset());
                })
                .doOnError(error -> {
                    log.error("Failed to publish event to topic: {}, error: {}", topic, error.getMessage());
                    throw new RuntimeException("Failed to publish event", error);
                })
                .then();
    }
}
