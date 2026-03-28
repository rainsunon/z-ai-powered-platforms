package com.xrs.asset.assetservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.web.client.RestTemplate;

/**
 * Asset Service Application
 * Microservice responsible for asset management, assignments, categories, locations, and types
 * Port: 8082
 */
@SpringBootApplication
@EnableAspectJAutoProxy(proxyTargetClass = true)
@ComponentScan(basePackages = {
    "com.xrs.assetmanagementsystem.assetservice",
    "com.xrs.assetmanagementsystem.aspect",
    "com.xrs.assetmanagementsystem.config",
    "com.xrs.assetmanagementsystem.exception",
    "com.xrs.assetmanagementsystem.security",
    "com.xrs.assetmanagementsystem.mapper"
})
@EntityScan(basePackages = "com.xrs.assetmanagementsystem.entity")
@EnableJpaRepositories(basePackages = "com.xrs.assetmanagementsystem.assetservice.repository")
public class AssetServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(AssetServiceApplication.class, args);
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}


