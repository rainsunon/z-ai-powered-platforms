package com.xrs.bffservice.client;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Slf4j
@Component
public class RatingServiceFallback implements RatingServiceClient {
    
    @Override
    public Flux<Object> findRatingsByProductId(Integer productId) {
        log.error("Rating service is unavailable - cannot fetch ratings for product: {}", productId);
        return Flux.empty();
    }
    
    @Override
    public Mono<Double> getAverageRating(Integer productId) {
        log.error("Rating service is unavailable - returning default rating for product: {}", productId);
        return Mono.just(0.0);
    }
}
