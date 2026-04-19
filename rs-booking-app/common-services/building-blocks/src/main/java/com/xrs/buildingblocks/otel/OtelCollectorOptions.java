package com.xrs.buildingblocks.otel;


import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * @author Rui S.
 * @date 2026-02-06
 * @apiNote
 */
@ConfigurationProperties(prefix = "spring.otel.collector")
@Getter
@Setter
public class OtelCollectorOptions {
    private String endpoint;
    private String serviceName;
    private String serviceVersion;
}