package com.xrs.bffservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@FeignClient(
    name = "RATING-SERVICE",
    fallback = RatingServiceFallback.class,
    configuration = com.xrs.bffservice.config.FeignConfig.class
)
public interface RatingServiceClient {
    
    @GetMapping("/api/ratings/product/{productId}")
    Flux<Object> findRatingsByProductId(@PathVariable("productId") Integer productId);
    
    @GetMapping("/api/ratings/product/{productId}/average")
    Mono<Double> getAverageRating(@PathVariable("productId") Integer productId);
}
