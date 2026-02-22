package com.xrs.userservice.model.dto.request;

public record ChangePasswordRequest(
    String oldPassword,
    String newPassword,
    String confirmPassword
) {
}
