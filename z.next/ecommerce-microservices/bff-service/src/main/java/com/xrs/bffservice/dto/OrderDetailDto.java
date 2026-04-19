package com.xrs.bffservice.dto;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Order details with product, payment, and shipping information
 */
public record OrderDetailDto(
    Integer orderId,
    LocalDateTime orderDate,
    String orderStatus,
    Double orderFee,
    Object userInfo,
    List<Object> orderItems,
    Object paymentInfo,
    Object shippingInfo
) implements Serializable {
}
