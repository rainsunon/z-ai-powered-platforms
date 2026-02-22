package com.xrs.productservice.handler;

import com.xrs.commonlib.cqrs.Query;
import com.xrs.commonlib.cqrs.QueryHandler;
import com.xrs.productservice.dto.ProductDto;
import com.xrs.productservice.dto.response.collection.DtoCollectionResponse;
import com.xrs.productservice.entity.Product;
import com.xrs.productservice.query.ListProductsQuery;
import com.xrs.productservice.repository.ProductRepository;
import com.xrs.productservice.helper.ProductMappingHelper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.List;

/**
 * Handler for ListProductsQuery.
 * Implements CQRS pattern for read operations.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ListProductsHandler implements QueryHandler<ListProductsQuery, DtoCollectionResponse<ProductDto>> {
    
    private final ProductRepository productRepository;
    
    @Override
    public Mono<DtoCollectionResponse<ProductDto>> handle(ListProductsQuery query) {
        return Mono.fromCallable(() -> {
            log.info("Listing products with filters: page={}, size={}, categoryId={}, search={}", 
                    query.page(), query.size(), query.categoryId(), query.searchKeyword());
            
            // Build page request
            Pageable pageable = PageRequest.of(query.page(), query.size());
            
            // Build sort
            Sort sort = buildSort(query.sortBy(), query.sortOrder());
            
            // Apply pagination and sorting
            Page<Product> products;
            if (query.categoryId() != null && !query.categoryId().isBlank()) {
                products = productRepository.findByCategoryId(query.categoryId(), pageable, sort);
            } else if (query.searchKeyword() != null && !query.searchKeyword().isBlank()) {
                products = productRepository.findByNameContainingIgnoreCase(query.searchKeyword(), pageable, sort);
            } else {
                products = productRepository.findAll(pageable, sort);
            }
            
            List<ProductDto> productDtos = products.getContent().stream()
                    .map(ProductMappingHelper::toDto)
                    .toList();
            
            log.info("Retrieved {} products", productDtos.size());
            
            return new DtoCollectionResponse<>(productDtos);
        });
    }
    
    @Override
    public Class<ListProductsQuery> getQueryType() {
        return ListProductsQuery.class;
    }
    
    /**
     * Build Sort object from query parameters.
     */
    private Sort buildSort(String sortBy, String sortOrder) {
        Sort.Direction direction = sortOrder != null && sortOrder.equalsIgnoreCase("desc") 
                ? Sort.Direction.DESC 
                : Sort.Direction.ASC;
        
        return Sort.by(direction == Sort.Direction.ASC ? Sort.Order.ASC : Sort.Order.DESC, sortBy);
    }
}
