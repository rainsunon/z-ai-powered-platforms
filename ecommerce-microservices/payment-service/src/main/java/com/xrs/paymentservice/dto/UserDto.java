package com.xrs.paymentservice.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import java.io.Serializable;

public record UserDto(
    Long id,
    
    @JsonInclude(Include.NON_NULL)
    String fullname,
    
    @JsonInclude(Include.NON_NULL)
    String username,
    
    @JsonInclude(Include.NON_NULL)
    String email,
    
    @JsonInclude(Include.NON_NULL)
    String gender,
    
    @JsonInclude(Include.NON_NULL)
    String phone,
    
    @JsonInclude(Include.NON_NULL)
    String avatar
) implements Serializable {
}