package com.xrs.gateway.botdefense.consumer;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Configuration for the step-up consumer pipeline.
 */
@ConfigurationProperties(prefix = "botdefense.consumer")
public class ConsumerProperties {

    /**
     * Base URL of the CAPTCHA provider (mock in this repository).
     */
    private String captchaProviderBaseUrl = "http://localhost:8082";

    /**
     * Request timeout in milliseconds.
     */
    private long captchaRequestTimeoutMs = 2000;

    /**
     * How long to keep eventId dedupe marker in Redis.
     */
    private long dedupeTtlSeconds = 86400;

    /**
     * Kafka topics.
     */
    private String inputTopic = "captcha-stepup-events";
    private String securityActionTopic = "security-action-requests";
    private String dlqTopic = "captcha-stepup-dlq";

    public String getCaptchaProviderBaseUrl() {
        return captchaProviderBaseUrl;
    }

    public void setCaptchaProviderBaseUrl(String captchaProviderBaseUrl) {
        this.captchaProviderBaseUrl = captchaProviderBaseUrl;
    }

    public long getCaptchaRequestTimeoutMs() {
        return captchaRequestTimeoutMs;
    }

    public void setCaptchaRequestTimeoutMs(long captchaRequestTimeoutMs) {
        this.captchaRequestTimeoutMs = captchaRequestTimeoutMs;
    }

    public long getDedupeTtlSeconds() {
        return dedupeTtlSeconds;
    }

    public void setDedupeTtlSeconds(long dedupeTtlSeconds) {
        this.dedupeTtlSeconds = dedupeTtlSeconds;
    }

    public String getInputTopic() {
        return inputTopic;
    }

    public void setInputTopic(String inputTopic) {
        this.inputTopic = inputTopic;
    }

    public String getSecurityActionTopic() {
        return securityActionTopic;
    }

    public void setSecurityActionTopic(String securityActionTopic) {
        this.securityActionTopic = securityActionTopic;
    }

    public String getDlqTopic() {
        return dlqTopic;
    }

    public void setDlqTopic(String dlqTopic) {
        this.dlqTopic = dlqTopic;
    }
}
