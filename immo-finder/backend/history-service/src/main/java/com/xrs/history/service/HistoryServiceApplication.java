package com.xrs.history.service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.web.client.RestTemplate;

/**
 * History Service Application
 * Microservice responsible for asset history and audit trail management
 * Port: 8084
 */
@SpringBootApplication
@EnableAspectJAutoProxy(proxyTargetClass = true)
@ComponentScan(basePackages = {
    "com.xrs.assetmanagementsystem.historyservice",
    "com.xrs.assetmanagementsystem.aspect",
    "com.xrs.assetmanagementsystem.config",
    "com.xrs.assetmanagementsystem.exception",
    "com.xrs.assetmanagementsystem.security",
    "com.xrs.assetmanagementsystem.mapper"
})
@EntityScan(basePackages = "com.xrs.assetmanagementsystem.entity")
@EnableJpaRepositories(basePackages = "com.xrs.assetmanagementsystem.historyservice.repository")
public class HistoryServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(HistoryServiceApplication.class, args);
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}

