package com.xrs.paymentservice.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.xrs.paymentservice.entity.PaymentStatus;

import java.io.Serializable;

public record PaymentDto(
    Integer paymentId,
    Boolean isPayed,
    PaymentStatus paymentStatus,
    Integer orderId,
    Long userId,
    
    @JsonProperty("order")
    @JsonInclude(Include.NON_NULL)
    OrderDto orderDto,
    
    @JsonProperty("user")
    @JsonInclude(Include.NON_NULL)
    UserDto userDto
) implements Serializable {
}
