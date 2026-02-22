package com.xrs.bffservice.dto;

import java.io.Serializable;
import java.util.List;

/**
 * Complete checkout information including cart, products, shipping, and payment
 */
public record CheckoutDto(
    Object cart,
    List<Object> cartItems,
    Object shippingInfo,
    Object paymentInfo,
    Double totalAmount,
    Double shippingCost,
    Double taxAmount
) implements Serializable {
}
