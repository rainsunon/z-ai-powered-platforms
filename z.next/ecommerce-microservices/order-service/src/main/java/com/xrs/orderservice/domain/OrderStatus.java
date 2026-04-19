package com.xrs.orderservice.domain;

import java.util.EnumSet;
import java.util.Set;

/**
 * Order status enum representing the lifecycle of an order in the saga pattern
 * Defines valid state transitions based on domain rules
 */
public enum OrderStatus {
    /**
     * Order created, awaiting inventory reservation
     */
    PENDING,

    /**
     * Inventory reserved successfully, order confirmed
     */
    CONFIRMED,

    /**
     * Payment completed successfully
     */
    PAID,

    /**
     * Order shipped to customer
     */
    SHIPPED,

    /**
     * Order delivered to customer
     */
    DELIVERED,

    /**
     * Order cancelled (compensation in saga)
     */
    CANCELLED,

    /**
     * Order failed during processing
     */
    FAILED;

    /**
     * Check if transition from current status to target status is valid
     */
    public boolean canTransitionTo(OrderStatus targetStatus) {
        return getAllowedTransitions(this).contains(targetStatus);
    }

    /**
     * Get all allowed transitions from a given status
     */
    private static Set<OrderStatus> getAllowedTransitions(OrderStatus from) {
        return switch (from) {
            case PENDING -> EnumSet.of(CONFIRMED, CANCELLED, FAILED);
            case CONFIRMED -> EnumSet.of(PAID, CANCELLED, FAILED);
            case PAID -> EnumSet.of(SHIPPED, CANCELLED, FAILED);
            case SHIPPED -> EnumSet.of(DELIVERED, FAILED);
            case DELIVERED -> EnumSet.noneOf(OrderStatus.class); // Terminal state
            case CANCELLED -> EnumSet.noneOf(OrderStatus.class); // Terminal state
            case FAILED -> EnumSet.noneOf(OrderStatus.class); // Terminal state
        };
    }

    /**
     * Check if this is a terminal state (no further transitions allowed)
     */
    public boolean isTerminal() {
        return this == DELIVERED || this == CANCELLED || this == FAILED;
    }

    /**
     * Check if order can be cancelled from this state
     */
    public boolean isCancellable() {
        return this == PENDING || this == CONFIRMED || this == PAID;
    }
}
