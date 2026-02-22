package com.xrs.fooddelivery.payment.kafka;

import com.xrs.fooddelivery.payment.dto.PaymentResponse;
import com.xrs.fooddelivery.payment.dto.PaymentStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;
import org.springframework.util.concurrent.ListenableFuture;
import org.springframework.util.concurrent.ListenableFutureCallback;

@Service
@Slf4j
@RequiredArgsConstructor
public class PaymentEventProducer {
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Value("${kafka.topic.payment-created}")
    private String paymentCreatedTopic;

    @Value("${kafka.topic.payment-authorized}")
    private String paymentAuthorizedTopic;

    @Value("${kafka.topic.payment-captured}")
    private String paymentCapturedTopic;

    @Value("${kafka.topic.payment-failed}")
    private String paymentFailedTopic;

    public void publishPaymentCreated(String paymentId, PaymentResponse paymentResponse) {
        publishEvent(paymentCreatedTopic, paymentId, paymentResponse, "PaymentCreated");
    }

    public void publishPaymentAuthorized(String paymentId, PaymentResponse paymentResponse) {
        publishEvent(paymentAuthorizedTopic, paymentId, paymentResponse, "PaymentAuthorized");
    }

    public void publishPaymentCaptured(String paymentId, PaymentResponse paymentResponse) {
        publishEvent(paymentCapturedTopic, paymentId, paymentResponse, "PaymentCaptured");
    }

    public void publishPaymentFailed(String paymentId, PaymentResponse paymentResponse) {
        publishEvent(paymentFailedTopic, paymentId, paymentResponse, "PaymentFailed");
    }

    private void publishEvent(String topic, String key, Object event, String eventType) {
        try {
            ListenableFuture<SendResult<String, Object>> future = kafkaTemplate.send(topic, key, event);

            future.addCallback(new ListenableFutureCallback<SendResult<String, Object>>() {
                @Override
                public void onSuccess(SendResult<String, Object> result) {
                    log.info("{} event published successfully to topic: {}, key: {}, partition: {}",
                            eventType, topic, key, result.getRecordMetadata().partition());
                }

                @Override
                public void onFailure(Throwable ex) {
                    log.error("Failed to publish {} event to topic: {}, key: {}", eventType, topic, key, ex);
                }
            });
        } catch (Exception e) {
            log.error("Error publishing {} event to topic: {}, key: {}", eventType, topic, key, e);
        }
    }
}
