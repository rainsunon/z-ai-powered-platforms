package com.github.dimitryivaniuta.audittrail.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Jackson configuration.
 *
 * <p>We enable deterministic JSON serialization (sorted map entries + alphabetic properties)
 * for stable hash computation.</p>
 */
@Configuration
public class JacksonConfig {

    /**
     * Creates a deterministic {@link ObjectMapper}.
     *
     * @return object mapper
     */
    @Bean
    public ObjectMapper objectMapper() {
        return JsonMapper.builder()
                .addModule(new JavaTimeModule())
                .enable(SerializationFeature.ORDER_MAP_ENTRIES_BY_KEYS)
                .configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false)
                .build()
                .copy()
                .enable(SerializationFeature.SORT_PROPERTIES_ALPHABETICALLY);
    }
}
