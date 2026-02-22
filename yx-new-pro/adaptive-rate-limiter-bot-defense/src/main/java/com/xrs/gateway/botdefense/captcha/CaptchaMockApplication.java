package com.xrs.gateway.botdefense.captcha;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

/**
 * Mock CAPTCHA provider service.
 */
@SpringBootApplication(scanBasePackages = "com.xrs.gateway.botdefense")
@EnableConfigurationProperties(CaptchaMockProperties.class)
public class CaptchaMockApplication {

    public static void main(String[] args) {
        SpringApplication.run(CaptchaMockApplication.class, args);
    }
}
