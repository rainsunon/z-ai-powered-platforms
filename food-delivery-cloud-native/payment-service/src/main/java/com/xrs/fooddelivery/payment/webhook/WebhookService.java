package com.xrs.fooddelivery.payment.webhook;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.xrs.fooddelivery.payment.dto.PaymentResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;

import java.time.Duration;

@Service
@Slf4j
@RequiredArgsConstructor
public class WebhookService {
    private final WebClient.Builder webClientBuilder;
    private final ObjectMapper objectMapper;

    public void sendWebhook(String webhookUrl, PaymentResponse paymentResponse) {
        try {
            String payload = objectMapper.writeValueAsString(paymentResponse);
            log.info("Sending webhook to {}: {}", webhookUrl, payload);

            WebClient webClient = webClientBuilder.build();

            webClient.post()
                    .uri(webhookUrl)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(payload)
                    .retrieve()
                    .bodyToMono(String.class)
                    .retryWhen(Retry.backoff(3, Duration.ofSeconds(1))
                            .filter(throwable -> {
                                log.warn("Webhook retry for {}: {}", webhookUrl, throwable.getMessage());
                                return true;
                            }))
                    .doOnSuccess(response -> log.info("Webhook sent successfully to {}", webhookUrl))
                    .doOnError(error -> log.error("Failed to send webhook to {}: {}", webhookUrl, error.getMessage()))
                    .subscribe();
        } catch (Exception e) {
            log.error("Error preparing webhook payload: {}", e.getMessage(), e);
        }
    }

    public void sendWebhookSync(String webhookUrl, PaymentResponse paymentResponse) {
        try {
            String payload = objectMapper.writeValueAsString(paymentResponse);
            log.info("Sending webhook synchronously to {}: {}", webhookUrl, payload);

            WebClient webClient = webClientBuilder.build();

            String response = webClient.post()
                    .uri(webhookUrl)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(payload)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            log.info("Webhook response from {}: {}", webhookUrl, response);
        } catch (Exception e) {
            log.error("Error sending webhook synchronously to {}: {}", webhookUrl, e.getMessage(), e);
        }
    }
}
