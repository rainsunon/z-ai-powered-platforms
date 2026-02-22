package com.xrs.gateway.botdefense.consumer;

import com.xrs.gateway.botdefense.net.IpResolverProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

/**
 * Entry point for the Kafka step-up consumer pipeline.
 */
@SpringBootApplication(scanBasePackages = "com.xrs.gateway.botdefense")
@EnableConfigurationProperties({ConsumerProperties.class, IpResolverProperties.class})
public class StepUpConsumerApplication {

    /**
     * Main method.
     */
    public static void main(String[] args) {
        SpringApplication.run(StepUpConsumerApplication.class, args);
    }
}
