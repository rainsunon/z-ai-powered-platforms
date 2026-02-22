package com.xrs.gateway.botdefense.config;

import com.xrs.gateway.botdefense.web.AdaptiveRateLimitFilter;
import com.xrs.gateway.botdefense.web.CorrelationIdFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Explicitly orders filters.
 */
@Configuration
public class WebFilterConfig {

    @Bean
    public FilterRegistrationBean<CorrelationIdFilter> correlationIdFilterRegistration(CorrelationIdFilter filter) {
        FilterRegistrationBean<CorrelationIdFilter> reg = new FilterRegistrationBean<>(filter);
        reg.setOrder(0);
        return reg;
    }

    @Bean
    public FilterRegistrationBean<AdaptiveRateLimitFilter> adaptiveRateLimitFilterRegistration(AdaptiveRateLimitFilter filter) {
        FilterRegistrationBean<AdaptiveRateLimitFilter> reg = new FilterRegistrationBean<>(filter);
        reg.setOrder(10);
        return reg;
    }
}
