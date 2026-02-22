package com.xrs.gateway.botdefense.captcha;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Settings for the mock CAPTCHA provider.
 */
@ConfigurationProperties(prefix = "captcha.mock")
public class CaptchaMockProperties {

    /**
     * Artificial delay in milliseconds.
     */
    private long delayMs = 50;

    /**
     * Fail every N requests (0 = never).
     */
    private int failEveryN = 0;

    public long getDelayMs() {
        return delayMs;
    }

    public void setDelayMs(long delayMs) {
        this.delayMs = delayMs;
    }

    public int getFailEveryN() {
        return failEveryN;
    }

    public void setFailEveryN(int failEveryN) {
        this.failEveryN = failEveryN;
    }
}
