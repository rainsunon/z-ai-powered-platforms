package com.xrs.gateway.botdefense.api;

import com.xrs.gateway.botdefense.risk.RiskSignalStore;
import com.xrs.gateway.botdefense.web.AdaptiveRateLimitFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;

/**
 * Demo login endpoint to showcase bot-defense for authentication.
 *
 * <p>In real systems, you'd delegate to your IdP / authentication backend.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final RiskSignalStore signals;

    public AuthController(RiskSignalStore signals) {
        this.signals = signals;
    }

    /**
     * Demo login: accepts any username; requires password == "password".
     *
     * <p>On failures we record signals in Redis to increase risk and trigger step-up.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest body,
                                   @RequestHeader(value = AdaptiveRateLimitFilter.TENANT_HEADER, required = false) String tenantId,
                                   HttpServletRequest request) {

        String ip = request.getRemoteAddr();
        String userId = body.username();

        if (!"password".equals(body.password())) {
            signals.recordLoginFailure(safe(tenantId), safe(userId), ip);
            return ResponseEntity.status(401).body(Map.of(
                    "code", "INVALID_CREDENTIALS",
                    "message", "Invalid username or password",
                    "timestamp", Instant.now().toString()
            ));
        }

        signals.clearLoginFailures(safe(tenantId), safe(userId), ip);
        return ResponseEntity.ok(Map.of(
                "accessToken", "demo-token-" + userId,
                "tokenType", "Bearer",
                "expiresInSeconds", 3600,
                "timestamp", Instant.now().toString()
        ));
    }

    /**
     * Login request.
     */
    public record LoginRequest(@NotBlank String username, @NotBlank String password) {
    }

    private static String safe(String s) {
        return s == null || s.isBlank() ? "-" : s;
    }
}
