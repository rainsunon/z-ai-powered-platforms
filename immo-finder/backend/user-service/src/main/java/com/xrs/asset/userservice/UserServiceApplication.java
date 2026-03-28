package com.xrs.asset.userservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.web.client.RestTemplate;

/**
 * User Service Application
 * Microservice responsible for user management, authentication, and authorization
 * Port: 8081
 */
@SpringBootApplication
@EnableAspectJAutoProxy(proxyTargetClass = true)
@ComponentScan(basePackages = {
    "com.xrs.assetmanagementsystem.userservice",
    "com.xrs.assetmanagementsystem.aspect",
    "com.xrs.assetmanagementsystem.config",
    "com.xrs.assetmanagementsystem.exception",
    "com.xrs.assetmanagementsystem.security",
    "com.xrs.assetmanagementsystem.mapper"
})
@EntityScan(basePackages = "com.xrs.assetmanagementsystem.entity")
@EnableJpaRepositories(basePackages = "com.xrs.assetmanagementsystem.userservice.repository")
public class UserServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}

