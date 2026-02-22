package com.xrs.gateway.botdefense.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;

/**
 * Example public endpoints protected by adaptive throttling.
 */
@RestController
@RequestMapping("/api/public")
public class PublicApiController {

    @GetMapping("/ping")
    public Map<String, Object> ping() {
        return Map.of(
                "status", "ok",
                "timestamp", Instant.now().toString()
        );
    }

    @PostMapping("/echo")
    public Map<String, Object> echo(@Valid @RequestBody EchoRequest req) {
        return Map.of(
                "echo", req.message(),
                "timestamp", Instant.now().toString()
        );
    }

    /**
     * Simple request body.
     */
    public record EchoRequest(@NotBlank String message) {
    }
}
