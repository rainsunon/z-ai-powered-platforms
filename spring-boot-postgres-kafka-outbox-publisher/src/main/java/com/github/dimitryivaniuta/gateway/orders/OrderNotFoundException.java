package com.github.dimitryivaniuta.gateway.orders;

import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception used when an order is not found.
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class OrderNotFoundException extends RuntimeException {

    /**
     * Creates an exception.
     *
     * @param id missing order id
     */
    public OrderNotFoundException(UUID id) {
        super("Order not found: " + id);
    }
}
