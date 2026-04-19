package com.xrs.userservice.model.dto.request;

public record UserDto(
    Long id,
    String fullname,
    String username,
    String email,
    String gender,
    String phone,
    String avatar
) {
}
