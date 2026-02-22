package com.xrs.gateway.botdefense.consumer;

import com.xrs.gateway.botdefense.kafka.BotDefenseEvent;
import io.github.resilience4j.retry.Retry;
import io.github.resilience4j.retry.RetryConfig;
import io.github.resilience4j.timelimiter.TimeLimiter;
import io.github.resilience4j.timelimiter.TimeLimiterConfig;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.net.http.HttpClient;
import java.time.Duration;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.Callable;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.function.Supplier;

/**
 * Client calling a CAPTCHA provider.
 * <p>
 * Uses retry/backoff and timeout policies.
 */
@Component
public class CaptchaProviderClient {

    private final RestClient restClient;
    private final Retry retry;
    private final TimeLimiter timeLimiter;
    private final ExecutorService executor;

    public CaptchaProviderClient(ConsumerProperties props) {
        HttpClient httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofMillis(props.getCaptchaRequestTimeoutMs()))
                .build();

        this.restClient = RestClient.builder()
                .baseUrl(props.getCaptchaProviderBaseUrl())
                .requestFactory(new JdkClientHttpRequestFactory(httpClient))
                .build();

        RetryConfig retryConfig = RetryConfig.custom()
                .maxAttempts(4)
                .waitDuration(Duration.ofMillis(200))
                .build();
        this.retry = Retry.of("captchaProvider", retryConfig);

        TimeLimiterConfig tl = TimeLimiterConfig.custom()
                .timeoutDuration(Duration.ofMillis(props.getCaptchaRequestTimeoutMs()))
                .cancelRunningFuture(true)
                .build();
        this.timeLimiter = TimeLimiter.of(tl);

        this.executor = Executors.newCachedThreadPool();
    }

    /**
     * Trigger CAPTCHA / step-up action.
     *
     * @return provider response body as string
     */
    public String triggerCaptcha(BotDefenseEvent event) throws Exception {
        Map<String, Object> body = Map.of(
                "requestId", UUID.randomUUID().toString(),
                "eventId", event.eventId(),
                "correlationId", event.correlationId(),
                "tenantId", event.tenantId(),
                "userId", event.userId(),
                "ip", event.ip(),
                "riskScore", event.riskScore(),
                "action", event.action(),
                "reason", event.reason()
        );

        Supplier<String> decorated = Retry.decorateSupplier(retry, () ->
                restClient.post()
                        .uri("/captcha/trigger")
                        .body(body)
                        .retrieve()
                        .body(String.class)
        );

        Callable<String> call = decorated::get;
        Callable<String> timedCallable = TimeLimiter.decorateFutureSupplier(timeLimiter,
                () -> CompletableFuture.supplyAsync(() -> {
                    try {
                        return call.call();
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                }, executor));

        try {
            return timedCallable.call();
        } catch (Exception e) {
            // unwrap
            Throwable t = e.getCause() != null ? e.getCause() : e;
            if (t instanceof RuntimeException re && re.getCause() != null) {
                t = re.getCause();
            }
            if (t instanceof Exception ex) {
                throw ex;
            }
            throw new Exception(t);
        }
    }
}
