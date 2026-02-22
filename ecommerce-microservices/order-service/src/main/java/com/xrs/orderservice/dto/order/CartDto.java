package com.xrs.orderservice.dto.order;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.xrs.orderservice.dto.user.UserDto;

import java.io.Serializable;
import java.util.Set;

public record CartDto(
    Integer cartId,
    Long userId,
    
    @JsonProperty("order")
    @JsonInclude(Include.NON_NULL)
    Set<OrderDto> orderDtos,
    
    @JsonProperty("user")
    @JsonInclude(Include.NON_NULL)
    UserDto userDto
) implements Serializable {
}