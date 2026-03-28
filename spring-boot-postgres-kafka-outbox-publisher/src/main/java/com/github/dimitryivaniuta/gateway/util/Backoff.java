package com.github.dimitryivaniuta.gateway.util;

import java.time.Duration;
import java.util.concurrent.ThreadLocalRandom;

/**
 * Exponential backoff utility with jitter.
 */
public final class Backoff {

    private Backoff() {
    }

    /**
     * Computes an exponential backoff delay with "full jitter".
     *
     * <p>Formula (bounded):
     * <pre>
     * cap = min(maxBackoff, baseBackoff * 2^attempt)
     * delay = random(0, cap)
     * </pre>
     * </p>
     *
     * @param attemptZeroBased attempt number starting at 0
     * @param baseBackoff base backoff duration
     * @param maxBackoff maximum backoff duration
     * @return delay duration
     */
    public static Duration fullJitter(int attemptZeroBased, Duration baseBackoff, Duration maxBackoff) {
        if (attemptZeroBased < 0) {
            attemptZeroBased = 0;
        }
        double o = Math.pow(2.0, attemptZeroBased);
        long capMillis = safeMultiplyMillis(baseBackoff, o);
        long bounded = Math.min(capMillis, maxBackoff.toMillis());
        if (bounded <= 0) {
            return Duration.ZERO;
        }
        long delay = ThreadLocalRandom.current().nextLong(0, bounded + 1);
        return Duration.ofMillis(delay);
    }

    private static long safeMultiplyMillis(Duration base, double factor) {
        double millis = base.toMillis() * factor;
        if (millis > Long.MAX_VALUE) {
            return Long.MAX_VALUE;
        }
        return (long) millis;
    }
}
