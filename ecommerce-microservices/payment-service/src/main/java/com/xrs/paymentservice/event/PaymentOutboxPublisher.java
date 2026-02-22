package com.xrs.paymentservice.event;

import com.google.gson.Gson;
import com.xrs.commonlib.outbox.OutboxEvent;
import com.xrs.commonlib.outbox.OutboxPublisher;
import com.xrs.paymentservice.entity.PaymentOutboxEvent;
import com.xrs.paymentservice.repository.PaymentOutboxEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Outbox publisher for payment service.
 * Extends the abstract OutboxPublisher from common-lib.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class PaymentOutboxPublisher extends OutboxPublisher<PaymentOutboxEvent> {
    
    private final PaymentOutboxEventRepository repository;
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final Gson gson = new Gson();
    
    @Override
    protected PaymentOutboxEvent createOutboxEvent(String topic, String aggregateId, Object payload, 
                                                    String correlationId, String aggregateType) {
        return new PaymentOutboxEvent(topic, aggregateId, payload, correlationId, aggregateType);
    }
    
    @Override
    protected PaymentOutboxEvent saveEvent(PaymentOutboxEvent event) {
        return repository.save(event);
    }
    
    @Override
    protected void publishToBroker(String topic, String key, String payload) {
        kafkaTemplate.send(topic, key, payload)
                .whenComplete((result, ex) -> {
                    if (ex != null) {
                        log.error("Failed to send event to Kafka topic {}: {}", topic, ex.getMessage());
                    } else {
                        log.info("Successfully sent event to Kafka topic {}: {}", topic, result.getRecordMetadata().offset());
                    }
                });
    }
    
    @Override
    protected void markAsPublished(PaymentOutboxEvent event) {
        event.setPublished(true);
        event.setPublishedAt(LocalDateTime.now());
        repository.save(event);
    }
    
    @Override
    protected void incrementRetryCount(PaymentOutboxEvent event) {
        event.setRetryCount(event.getRetryCount() + 1);
        repository.save(event);
    }
    
    @Override
    protected void setErrorMessage(PaymentOutboxEvent event, String errorMessage) {
        event.setErrorMessage(errorMessage);
        repository.save(event);
    }
    
    @Override
    protected void deleteOldEvents(LocalDateTime cutoffDate) {
        repository.deleteOldPublishedEvents(cutoffDate);
    }
    
    @Override
    protected Gson getGson() {
        return gson;
    }
}
