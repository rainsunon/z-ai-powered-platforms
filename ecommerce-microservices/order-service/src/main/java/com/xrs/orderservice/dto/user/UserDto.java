package com.xrs.orderservice.dto.user;

import java.io.Serializable;

public record UserDto(
    Long id,
    String fullname,
    String username,
    String email,
    String gender,
    String phone,
    String avatar
) implements Serializable {
}