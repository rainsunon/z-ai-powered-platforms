package com.xrs.productservice.service.impl;

import com.xrs.commonlib.cqrs.CommandBus;
import com.xrs.commonlib.cqrs.QueryBus;
import com.xrs.commonlib.idempotence.Idempotent;
import com.xrs.commonlib.outbox.OutboxService;
import com.xrs.productservice.command.CreateProductCommand;
import com.xrs.productservice.command.UpdateProductCommand;
import com.xrs.productservice.command.DeleteProductCommand;
import com.xrs.productservice.dto.ProductDto;
import com.xrs.productservice.entity.Product;
import com.xrs.productservice.event.ProductCreatedEvent;
import com.xrs.productservice.event.ProductUpdatedEvent;
import com.xrs.productservice.event.ProductDeletedEvent;
import com.xrs.productservice.repository.ProductRepository;
import com.xrs.productservice.service.ProductService;
import com.xrs.productservice.helper.ProductMappingHelper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;

/**
 * Service implementation for Product Service with CQRS, Outbox, and Idempotence patterns.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ProductServiceImpl implements ProductService {
    
    private final ProductRepository productRepository;
    private final CommandBus commandBus;
    private final QueryBus queryBus;
    private final OutboxService outboxService;
    
    @Override
    public Flux<List<ProductDto>> findAll() {
        log.info("ProductDto List, service; fetch all products");
        
        ListProductsQuery query = new ListProductsQuery(0, 10, null, null, "name", "asc");
        return queryBus.dispatch(query)
                .collectList()
                .flux();
    }
    
    @Override
    public ProductDto findById(Integer productId) {
        GetProductQuery query = new GetProductQuery(productId);
        return queryBus.dispatch(query).block();
    }
    
    /**
     * Create a new product using CQRS pattern.
     * Saves event to outbox transactionally.
     */
    @Override
    @Idempotent(ttl = 3600)  // 1 hour TTL
    @Transactional
    public ProductDto save(ProductDto productDto) {
        CreateProductCommand command = new CreateProductCommand(
            java.util.UUID.randomUUID().toString(),
            productDto.name(),
            productDto.description(),
            productDto.price(),
            productDto.categoryId(),
            "system" // userId for system operations
        );
        
        ProductDto savedProduct = commandBus.dispatch(command).block();
        
        log.info("Product created successfully: {}", savedProduct.productId());
        
        return savedProduct;
    }
    
    /**
     * Update an existing product using CQRS pattern (by ProductDto).
     * Saves event to outbox transactionally.
     */
    @Override
    @Idempotent(ttl = 3600)  // 1 hour TTL
    @Transactional
    public ProductDto update(ProductDto productDto) {
        UpdateProductCommand command = new UpdateProductCommand(
            productDto.productId(),
            productDto.name(),
            productDto.description(),
            productDto.price(),
            productDto.categoryId(),
            "system" // userId for system operations
        );
        
        ProductDto updatedProduct = commandBus.dispatch(command).block();
        
        log.info("Product updated successfully: {}", updatedProduct.productId());
        
        return updatedProduct;
    }
    
    /**
     * Update an existing product using CQRS pattern (by productId).
     * Saves event to outbox transactionally.
     */
    @Override
    @Idempotent(ttl = 3600)  // 1 hour TTL
    @Transactional
    public ProductDto update(Integer productId, ProductDto productDto) {
        UpdateProductCommand command = new UpdateProductCommand(
            productId,
            productDto.name(),
            productDto.description(),
            productDto.price(),
            productDto.categoryId(),
            "system" // userId for system operations
        );
        
        ProductDto updatedProduct = commandBus.dispatch(command).block();
        
        log.info("Product updated successfully: {}", productId);
        
        return updatedProduct;
    }
    
    /**
     * Delete a product using CQRS pattern.
     * Saves event to outbox transactionally.
     */
    @Override
    @Idempotent(ttl = 3600)  // 1 hour TTL
    @Transactional
    public void deleteById(Integer productId) {
        DeleteProductCommand command = new DeleteProductCommand(productId, "system");
        
        commandBus.dispatch(command).block();
        
        log.info("Product deleted successfully: {}", productId);
    }
    
    /**
     * Save product created event to outbox.
     */
    private void publishProductCreatedEvent(ProductDto product) {
        ProductCreatedEvent event = new ProductCreatedEvent(
                product.productId(),
                product.name(),
                product.price(),
                product.categoryId()
        );
        
        outboxService.saveEvent(
                "product.created",
                product.productId(),
                event,
                product.productId(),
                "Product"
        );
    }
    
    /**
     * Save product updated event to outbox.
     */
    private void publishProductUpdatedEvent(ProductDto product) {
        ProductUpdatedEvent event = new ProductUpdatedEvent(
                product.productId(),
                product.name(),
                product.price(),
                product.categoryId()
        );
        
        outboxService.saveEvent(
                "product.updated",
                product.productId(),
                event,
                product.productId(),
                "Product"
        );
    }
    
    /**
     * Save product deleted event to outbox.
     */
    private void publishProductDeletedEvent(Integer productId) {
        ProductDeletedEvent event = new ProductDeletedEvent(productId);
        
        outboxService.saveEvent(
                "product.deleted",
                String.valueOf(productId),
                event,
                String.valueOf(productId),
                "Product"
        );
    }
}
