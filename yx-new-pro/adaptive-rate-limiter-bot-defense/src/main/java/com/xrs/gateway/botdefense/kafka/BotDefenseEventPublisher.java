package com.xrs.gateway.botdefense.kafka;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.UUID;

/**
 * Publishes bot-defense events to Kafka (KRaft-compatible).
 */
@Component
public class BotDefenseEventPublisher {

    private static final Logger log = LoggerFactory.getLogger(BotDefenseEventPublisher.class);

    private final KafkaTemplate<String, BotDefenseEvent> kafka;
    private final String topic;

    public BotDefenseEventPublisher(KafkaTemplate<String, BotDefenseEvent> kafka,
                                   @Value("${botdefense.kafka.topic:bot-defense-actions}") String topic) {
        this.kafka = kafka;
        this.topic = topic;
    }

    /**
     * Publishes a step-up requirement.
     */
    public void publishStepUpRequired(String correlationId,
                                     String routeGroup,
                                     String tenantId,
                                     String userId,
                                     String ip,
                                     int riskScore,
                                     String action,
                                     String reason) {
        BotDefenseEvent event = new BotDefenseEvent(
                UUID.randomUUID().toString(),
                Instant.now(),
                correlationId,
                routeGroup,
                tenantId,
                userId,
                ip,
                riskScore,
                action,
                reason
        );

        // Keyed by IP to keep related actions in order.
        kafka.send(topic, ip, event).whenComplete((res, ex) -> {
            if (ex != null) {
                log.warn("Failed to publish bot-defense event to topic={}", topic, ex);
            } else {
                log.info("Published bot-defense event action={} riskScore={} ip={} tenantId={} userId={}",
                        action, riskScore, ip, tenantId, userId);
            }
        });
    }
}
