package com.xrs.gateway.botdefense.testsupport;

import com.redis.testcontainers.RedisContainer;
import org.testcontainers.containers.PostgreSQLContainer;

/**
 * Shared Testcontainers for integration tests.
 */
public final class Containers {

    public static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:16")
            .withDatabaseName("botdefense")
            .withUsername("botdefense")
            .withPassword("botdefense");

    public static final RedisContainer REDIS = new RedisContainer("redis:7");

    static {
        POSTGRES.start();
        REDIS.start();
    }

    private Containers() {
    }
}
