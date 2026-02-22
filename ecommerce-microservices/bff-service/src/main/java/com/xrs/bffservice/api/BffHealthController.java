package com.xrs.bffservice.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/bff")
@Tag(name = "BFF Health API", description = "Backend for Frontend - Health Check")
public class BffHealthController {
    
    @GetMapping("/health")
    @Operation(summary = "Health check endpoint")
    public Mono<ResponseEntity<Map<String, String>>> healthCheck() {
        log.info("BFF: Health check requested");
        return Mono.just(ResponseEntity.ok(Map.of(
            "status", "UP",
            "service", "BFF-SERVICE",
            "message", "Backend for Frontend is running"
        )));
    }
}
