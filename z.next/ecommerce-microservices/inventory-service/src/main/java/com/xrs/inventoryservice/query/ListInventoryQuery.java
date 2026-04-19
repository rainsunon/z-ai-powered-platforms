package com.xrs.inventoryservice.query;

import com.xrs.commonlib.cqrs.Query;
import com.xrs.inventoryservice.dto.response.InventoryResponse;
import com.xrs.inventoryservice.model.Inventory;
import com.xrs.inventoryservice.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.List;

/**
 * Query to list all inventory items.
 * Implements CQRS pattern for read operations.
 */
public record ListInventoryQuery(
    String queryId
) implements Query {

    @Override
    public String getQueryId() {
        return queryId;
    }

    @Override
    public String getQueryType() {
        return "ListInventory";
    }

    @Override
    public void validate() {
        // No validation needed
    }

    /**
     * Handler for ListInventoryQuery.
     */
    @Component
    @RequiredArgsConstructor
    @Slf4j
    public static class ListInventoryHandler implements QueryHandler<ListInventoryQuery, List<InventoryResponse>> {
        
        private final InventoryRepository inventoryRepository;
        
        @Override
        public Mono<List<InventoryResponse>> handle(ListInventoryQuery query) {
            log.info("Handling ListInventoryQuery: {}", query.queryId());
            
            // Find all inventory
            List<Inventory> inventories = inventoryRepository.findAll();
            
            log.info("Found {} inventory items", inventories.size());
            
            // Return inventory responses
            List<InventoryResponse> responses = inventories.stream()
                    .map(inventory -> new InventoryResponse(inventory.getProductName(), inventory.getQuantity() > 0))
                    .toList();
            
            return Mono.just(responses);
        }
    }
}
