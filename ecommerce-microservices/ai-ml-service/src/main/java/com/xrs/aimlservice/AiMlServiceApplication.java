package com.xrs.aimlservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(scanBasePackages = "com.xrs")
@EnableScheduling
public class AiMlServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AiMlServiceApplication.class, args);
    }
}