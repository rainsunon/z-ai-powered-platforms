package com.xrs.productservice.handler;

import com.xrs.commonlib.cqrs.Command;
import com.xrs.commonlib.cqrs.CommandHandler;
import com.xrs.commonlib.idempotence.Idempotent;
import com.xrs.productservice.command.CreateProductCommand;
import com.xrs.productservice.command.UpdateProductCommand;
import com.xrs.productservice.command.DeleteProductCommand;
import com.xrs.productservice.dto.ProductDto;
import com.xrs.productservice.entity.Product;
import com.xrs.productservice.repository.ProductRepository;
import com.xrs.productservice.service.ProductService;
import com.xrs.productservice.helper.ProductMappingHelper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

/**
 * Handler for CreateProductCommand.
 * Implements CQRS pattern for write operations.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CreateProductHandler implements CommandHandler<CreateProductCommand, ProductDto> {
    
    private final ProductRepository productRepository;
    private final ProductService productService;
    
    @Override
    public Mono<ProductDto> handle(CreateProductCommand command) {
        return Mono.fromCallable(() -> {
            log.info("Creating product with ID: {}", command.productId());
            
            // Create product entity
            Product product = new Product();
            product.setProductId(command.productId());
            product.setName(command.name());
            product.setDescription(command.description());
            product.setPrice(command.price());
            product.setCategoryId(command.categoryId());
            
            // Save to repository
            Product savedProduct = productRepository.save(product);
            
            log.info("Product created successfully: {}", savedProduct.getProductId());
            
            return ProductMappingHelper.toDto(savedProduct);
        });
    }
    
    @Override
    public Class<CreateProductCommand> getCommandType() {
        return CreateProductCommand.class;
    }
}
