package com.github.dimitryivaniuta.gateway.orders;

import java.util.List;
import lombok.Builder;

/**
 * Stable API contract for order search responses.
 *
 * <p>We avoid leaking Spring Data {@code Page} JSON format (which can change across versions)
 * and instead return an explicit response with paging metadata.</p>
 */
@Builder
public record OrderSearchResponse(
        List<OrderResponse> items,
        PageInfo page
) {

    /**
     * Paging metadata.
     *
     * @param page current page (0-based)
     * @param size page size
     * @param totalItems total number of matched items
     * @param totalPages total pages
     * @param hasNext whether next page exists
     * @param hasPrev whether previous page exists
     */
    @Builder
    public record PageInfo(
            int page,
            int size,
            long totalItems,
            int totalPages,
            boolean hasNext,
            boolean hasPrev
    ) {
    }
}
