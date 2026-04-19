package com.xrs.inventoryservice.query;

import com.xrs.commonlib.cqrs.Query;
import com.xrs.inventoryservice.dto.response.InventoryResponse;
import com.xrs.inventoryservice.model.Inventory;
import com.xrs.inventoryservice.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

/**
 * Query to get inventory by product ID.
 * Implements CQRS pattern for read operations.
 */
public record GetInventoryQuery(
    String queryId,
    Integer productId
) implements Query {

    @Override
    public String getQueryId() {
        return queryId;
    }

    @Override
    public String getQueryType() {
        return "GetInventory";
    }

    @Override
    public void validate() {
        if (productId == null) {
            throw new IllegalArgumentException("Product ID cannot be null");
        }
    }

    /**
     * Handler for GetInventoryQuery.
     */
    @Component
    @RequiredArgsConstructor
    @Slf4j
    public static class GetInventoryHandler implements QueryHandler<GetInventoryQuery, InventoryResponse> {
        
        private final InventoryRepository inventoryRepository;
        
        @Override
        public Mono<InventoryResponse> handle(GetInventoryQuery query) {
            log.info("Handling GetInventoryQuery: {}", query.queryId());
            
            // Find inventory
            Inventory inventory = inventoryRepository.findByProductId(query.productId())
                    .orElseThrow(() -> new IllegalArgumentException("Inventory not found for product ID: " + query.productId()));
            
            log.info("Inventory found for product {}: quantity={}", inventory.getProductName(), inventory.getQuantity());
            
            // Return inventory response
            return Mono.just(new InventoryResponse(inventory.getProductName(), inventory.getQuantity() > 0));
        }
    }
}
