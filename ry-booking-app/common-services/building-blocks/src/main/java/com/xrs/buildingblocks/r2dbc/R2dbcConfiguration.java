package com.xrs.buildingblocks.r2dbc;


import io.r2dbc.spi.ConnectionFactories;
import io.r2dbc.spi.ConnectionFactory;
import io.r2dbc.spi.ConnectionFactoryOptions;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.autoconfigure.r2dbc.R2dbcProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.ReactiveAuditorAware;
import org.springframework.r2dbc.connection.R2dbcTransactionManager;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.transaction.ReactiveTransactionManager;
import org.springframework.transaction.reactive.TransactionalOperator;

import java.net.URI;
import java.net.URISyntaxException;

/**
 * @author Rui S.
 * @date 2026-02-03
 * @apiNote
 */
@Configuration
public class R2dbcConfiguration {

    private final R2dbcProperties r2dbcProperties;

    public R2dbcConfiguration(R2dbcProperties r2dbcProperties) {
        this.r2dbcProperties = r2dbcProperties;
    }

    @Bean
    @ConditionalOnProperty("spring.r2dbc.url")
    public ConnectionFactory r2dbcConnectionFactory() throws URISyntaxException {
        String url = r2dbcProperties.getUrl();
        if (url == null || url.isEmpty()) {
            throw new IllegalArgumentException("R2DBC URL is required");
        }

        URI uri = new URI(url.replace("r2dbc:", ""));
        String driver = uri.getScheme();

        return ConnectionFactories.get(ConnectionFactoryOptions.builder()
                .option(ConnectionFactoryOptions.DRIVER, driver)
                .option(ConnectionFactoryOptions.HOST, uri.getHost())
                .option(ConnectionFactoryOptions.PORT, uri.getPort())
                .option(ConnectionFactoryOptions.DATABASE, uri.getPath().substring(1))
                .option(ConnectionFactoryOptions.USER, r2dbcProperties.getUsername())
                .option(ConnectionFactoryOptions.PASSWORD, r2dbcProperties.getPassword())
                .build());
    }

    @Bean(name = "r2dbcTransactionManager")
    public ReactiveTransactionManager transactionManager(ConnectionFactory connectionFactory) {
        return new R2dbcTransactionManager(connectionFactory);
    }

    @Bean
    public DatabaseClient databaseClient(ConnectionFactory connectionFactory) {
        return DatabaseClient.create(connectionFactory);
    }

    @Bean
    public TransactionalOperator transactionalOperator(ReactiveTransactionManager transactionManager) {
        return TransactionalOperator.create(transactionManager);
    }

    @Bean
    public ReactiveAuditorAware<Long> reactiveAuditorAware() {
        return new ReactiveAuditorAwareImpl();
    }
}