package com.xrs.gateway.botdefense;

import com.xrs.gateway.botdefense.config.BotDefenseProperties;
import com.xrs.gateway.botdefense.net.IpResolverProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

/**
 * Entry point for the Adaptive Rate Limiter + Bot Defense service.
 */
@SpringBootApplication
@EnableConfigurationProperties({BotDefenseProperties.class, IpResolverProperties.class})
public class BotDefenseApplication {

    /**
     * Main method.
     *
     * @param args arguments
     */
    public static void main(String[] args) {
        SpringApplication.run(BotDefenseApplication.class, args);
    }
}
