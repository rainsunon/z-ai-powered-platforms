package com.github.dimitryivaniuta.gateway.orders;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import java.util.UUID;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for the demo business API.
 */
@RestController
@org.springframework.validation.annotation.Validated
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final OrderRepository orderRepository;

    /**
     * Creates an order.
     *
     * <p>Business data and an outbox message are written in the same transaction.</p>
     *
     * @param request create request
     * @return created order response
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse create(@Valid @RequestBody CreateOrderRequest request) {
        return OrderResponse.fromEntity(orderService.createOrder(request));
    }

    /**
     * Reads an order by id.
     *
     * @param id order id
     * @return order
     */


/**
 * Searches orders by email fragment or id fragment (UUID as text).
 *
 * <p>Designed for the dashboard search bar. Results are paged and sorted by creation time
 * (newest first).</p>
 *
 * @param q query text (trimmed, non-blank)
 * @param page 0-based page index
 * @param size page size (max 100)
 * @return search response
 */
@GetMapping("/search")
public OrderSearchResponse search(
        @RequestParam("q") @NotBlank String q,
        @RequestParam(value = "page", defaultValue = "0") @Min(0) int page,
        @RequestParam(value = "size", defaultValue = "20") @Min(1) @Max(100) int size
) {
    var pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
    var result = orderRepository.search(q.trim(), pageable);

    return OrderSearchResponse.builder()
            .items(result.getContent().stream().map(OrderResponse::fromEntity).toList())
            .page(OrderSearchResponse.PageInfo.builder()
                    .page(result.getNumber())
                    .size(result.getSize())
                    .totalItems(result.getTotalElements())
                    .totalPages(result.getTotalPages())
                    .hasNext(result.hasNext())
                    .hasPrev(result.hasPrevious())
                    .build())
            .build();
}

    @GetMapping("/{id:[0-9a-fA-F\\-]{36}}")
    public OrderResponse getById(@PathVariable UUID id) {
        OrderEntity entity = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException(id));
        return OrderResponse.fromEntity(entity);
    }
}
