package com.github.dimitryivaniuta.gateway.orders;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

/**
 * Request payload for creating a new order.
 */
public record CreateOrderRequest(
        @NotBlank @Email String customerEmail,
        @NotNull @DecimalMin(value = "0.01") BigDecimal totalAmount
) {
}
