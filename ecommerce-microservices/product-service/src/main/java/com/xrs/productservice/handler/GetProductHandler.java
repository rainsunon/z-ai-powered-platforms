package com.xrs.productservice.handler;

import com.xrs.commonlib.cqrs.CommandHandler;
import com.xrs.commonlib.cqrs.Query;
import com.xrs.productservice.dto.ProductDto;
import com.xrs.productservice.entity.Product;
import com.xrs.productservice.query.GetProductQuery;
import com.xrs.productservice.repository.ProductRepository;
import com.xrs.productservice.helper.ProductMappingHelper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

/**
 * Handler for GetProductQuery.
 * Implements CQRS pattern for read operations.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class GetProductHandler implements QueryHandler<GetProductQuery, ProductDto> {
    
    private final ProductRepository productRepository;
    
    @Override
    public Mono<ProductDto> handle(GetProductQuery query) {
        return Mono.fromCallable(() -> {
            log.info("Getting product with ID: {}", query.productId());
            
            Product product = productRepository.findByProductId(query.productId())
                    .orElseThrow(() -> {
                        log.error("Product not found with ID: {}", query.productId());
                        throw new RuntimeException("Product not found with ID: " + query.productId());
                    });
            
            log.info("Product retrieved successfully: {}", product.getProductId());
            
            return ProductMappingHelper.toDto(product);
        });
    }
    
    @Override
    public Class<GetProductQuery> getQueryType() {
        return GetProductQuery.class;
    }
}
