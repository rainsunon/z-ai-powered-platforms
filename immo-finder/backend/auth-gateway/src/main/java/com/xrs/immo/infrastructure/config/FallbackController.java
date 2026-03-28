package com.xrs.immo.infrastructure.config;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/fallback")
public class FallbackController {

    @GetMapping("/{service}")
    public Map<String, Object> fallback(@PathVariable String service) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "fallback");
        response.put("service", service);
        response.put("message", "Service is currently unavailable. Please try again later.");
        return response;
    }
}
