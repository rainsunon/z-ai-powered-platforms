package com.xrs.asset.request;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.web.client.RestTemplate;

/**
 * Request Service Application
 * Microservice responsible for asset and maintenance request management
 * Port: 8083
 */
@SpringBootApplication
@EnableAspectJAutoProxy(proxyTargetClass = true)
@ComponentScan(basePackages = {
    "com.xrs.assetmanagementsystem.requestservice",
    "com.xrs.assetmanagementsystem.aspect",
    "com.xrs.assetmanagementsystem.config",
    "com.xrs.assetmanagementsystem.exception",
    "com.xrs.assetmanagementsystem.security",
    "com.xrs.assetmanagementsystem.mapper"
})
@EntityScan(basePackages = "com.xrs.assetmanagementsystem.entity")
@EnableJpaRepositories(basePackages = "com.xrs.assetmanagementsystem.requestservice.repository")
public class RequestServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(RequestServiceApplication.class, args);
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}


