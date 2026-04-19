package com.xrs.userservice.model.dto.request;

public record ResetPasswordRequest(
    String email,
    String newPassword
) {
}
