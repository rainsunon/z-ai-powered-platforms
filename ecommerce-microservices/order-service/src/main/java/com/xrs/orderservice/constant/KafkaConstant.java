package com.xrs.orderservice.constant;

/**
 * Kafka topic names and constants for order service
 * Following event-driven architecture patterns for order fulfillment saga
 */
public class KafkaConstant {
    
    // Order Events - Published by order-service
    public static final String ORDER_CREATED_TOPIC = "order.created";
    public static final String ORDER_CONFIRMED_TOPIC = "order.confirmed";
    public static final String ORDER_CANCELLED_TOPIC = "order.cancelled";
    public static final String ORDER_COMPLETED_TOPIC = "order.completed";
    
    // Inventory Events - Consumed from inventory-service
    public static final String INVENTORY_RESERVED_TOPIC = "inventory.reserved";
    public static final String INVENTORY_RESERVATION_FAILED_TOPIC = "inventory.reservation.failed";
    public static final String RESERVE_INVENTORY_REQUEST_TOPIC = "inventory.reserve.request";
    public static final String RELEASE_INVENTORY_REQUEST_TOPIC = "inventory.release.request";
    
    // Payment Events - Consumed from payment-service
    public static final String PAYMENT_COMPLETED_TOPIC = "payment.completed";
    public static final String PAYMENT_FAILED_TOPIC = "payment.failed";
    public static final String PROCESS_PAYMENT_REQUEST_TOPIC = "payment.process.request";
    public static final String REFUND_PAYMENT_REQUEST_TOPIC = "payment.refund.request";
    
    // Shipping Events - Consumed from shipping-service
    public static final String SHIPMENT_CREATED_TOPIC = "shipment.created";
    public static final String SHIPMENT_FAILED_TOPIC = "shipment.failed";
    public static final String CREATE_SHIPMENT_REQUEST_TOPIC = "shipment.create.request";
    public static final String CANCEL_SHIPMENT_REQUEST_TOPIC = "shipment.cancel.request";
    
    // Consumer Group IDs
    public static final String ORDER_CONSUMER_GROUP_ID = "order-service-group";
    
    // Order Status Constants
    public static final String STATUS_PENDING = "PENDING";
    public static final String STATUS_CONFIRMED = "CONFIRMED";
    public static final String STATUS_PAID = "PAID";
    public static final String STATUS_SHIPPED = "SHIPPED";
    public static final String STATUS_DELIVERED = "DELIVERED";
    public static final String STATUS_CANCELLED = "CANCELLED";
    
    private KafkaConstant() {
        // Private constructor to prevent instantiation
    }
}
