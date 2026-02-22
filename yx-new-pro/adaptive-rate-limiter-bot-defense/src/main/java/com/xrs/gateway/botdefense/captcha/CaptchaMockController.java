package com.xrs.gateway.botdefense.captcha;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Mock endpoint that simulates a CAPTCHA provider.
 */
@RestController
@Validated
public class CaptchaMockController {

    private static final Logger log = LoggerFactory.getLogger(CaptchaMockController.class);

    private final CaptchaMockProperties props;
    private final AtomicLong counter = new AtomicLong();

    public CaptchaMockController(CaptchaMockProperties props) {
        this.props = props;
    }

    /**
     * Trigger CAPTCHA.
     */
    @PostMapping(path = "/captcha/trigger")
    public ResponseEntity<Map<String, Object>> trigger(@Valid @RequestBody TriggerRequest req) throws InterruptedException {
        long n = counter.incrementAndGet();

        if (props.getDelayMs() > 0) {
            Thread.sleep(props.getDelayMs());
        }

        if (props.getFailEveryN() > 0 && (n % props.getFailEveryN() == 0)) {
            log.warn("Mock CAPTCHA failing requestId={} eventId={} (everyN={})", req.requestId, req.eventId, props.getFailEveryN());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("status", "FAILED", "timestamp", Instant.now().toString()));
        }

        log.info("Mock CAPTCHA OK requestId={} eventId={} action={}", req.requestId, req.eventId, req.action);
        return ResponseEntity.ok(Map.of(
                "status", "OK",
                "provider", "captcha-mock",
                "requestId", req.requestId,
                "eventId", req.eventId,
                "timestamp", Instant.now().toString()
        ));
    }

    /**
     * Incoming trigger request.
     */
    public static class TriggerRequest {
        @NotBlank
        public String requestId;
        @NotBlank
        public String eventId;
        public String correlationId;
        public String tenantId;
        public String userId;
        public String ip;
        public Integer riskScore;
        public String action;
        public String reason;
    }
}
