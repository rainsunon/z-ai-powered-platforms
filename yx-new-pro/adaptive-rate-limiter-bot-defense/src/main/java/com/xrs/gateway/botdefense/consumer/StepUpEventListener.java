package com.xrs.gateway.botdefense.consumer;

import com.xrs.gateway.botdefense.kafka.BotDefenseEvent;
import com.xrs.gateway.botdefense.kafka.CaptchaStepUpDlqEvent;
import com.xrs.gateway.botdefense.kafka.SecurityActionRequest;
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.UUID;

/**
 * Kafka consumer that reacts to step-up events.
 * <p>
 * Pipeline:
 * <ol>
 *     <li>Deduplicate by eventId (Redis SETNX + TTL)</li>
 *     <li>Call CAPTCHA provider HTTP endpoint with retry/backoff + timeout</li>
 *     <li>On success, publish a security-action request to another topic</li>
 *     <li>On persistent failure, publish a DLQ event and ack</li>
 * </ol>
 */
@Component
public class StepUpEventListener {

    private static final Logger log = LoggerFactory.getLogger(StepUpEventListener.class);

    private final ConsumerProperties props;
    private final EventDedupeRepository dedupe;
    private final CaptchaProviderClient captcha;
    private final KafkaTemplate<String, Object> kafka;

    private final Counter captchaSuccess;
    private final Counter captchaFailure;

    public StepUpEventListener(ConsumerProperties props,
                               EventDedupeRepository dedupe,
                               CaptchaProviderClient captcha,
                               KafkaTemplate<String, Object> kafka,
                               MeterRegistry registry) {
        this.props = props;
        this.dedupe = dedupe;
        this.captcha = captcha;
        this.kafka = kafka;
        this.captchaSuccess = registry.counter("captcha_trigger_success");
        this.captchaFailure = registry.counter("captcha_trigger_failure");
    }

    /**
     * Consume and process a bot-defense step-up event.
     */
    @KafkaListener(
            topics = "#{@consumerProperties.inputTopic}",
            groupId = "botdefense-stepup-consumer",
            containerFactory = "botDefenseKafkaListenerContainerFactory"
    )
    public void onMessage(ConsumerRecord<String, BotDefenseEvent> record, Acknowledgment ack) {
        BotDefenseEvent event = record.value();

        if (event == null) {
            ack.acknowledge();
            return;
        }

        // Idempotency handling
        if (!dedupe.tryMarkProcessed(event.eventId())) {
            log.debug("Duplicate eventId={}, skipping", event.eventId());
            ack.acknowledge();
            return;
        }

        try {
            String providerResponse = captcha.triggerCaptcha(event);
            captchaSuccess.increment();

            SecurityActionRequest req = new SecurityActionRequest(
                    UUID.randomUUID().toString(),
                    Instant.now(),
                    event.correlationId(),
                    event.tenantId(),
                    event.userId(),
                    event.ip(),
                    event.action(),
                    event.eventId(),
                    providerResponse
            );

            kafka.send(props.getSecurityActionTopic(), event.eventId(), req);
            log.info("Step-up triggered OK. eventId={} actionTopic={}", event.eventId(), props.getSecurityActionTopic());
            ack.acknowledge();

        } catch (Exception ex) {
            captchaFailure.increment();
            log.warn("Step-up processing failed after retries. eventId={} error={}", event.eventId(), ex.toString());

            CaptchaStepUpDlqEvent dlq = new CaptchaStepUpDlqEvent(
                    UUID.randomUUID().toString(),
                    Instant.now(),
                    event,
                    ex.getMessage(),
                    ex.getClass().getName()
            );
            kafka.send(props.getDlqTopic(), event.eventId(), dlq);
            ack.acknowledge();
        }
    }
}
