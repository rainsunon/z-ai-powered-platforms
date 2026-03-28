package com.xrs.immo.application.service;

import com.xrs.immo.domain.model.Favorite;
import com.xrs.immo.domain.repository.FavoriteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class FavoriteService {

    private final FavoriteRepository repository;
    private final RedisTemplate<String, Object> redisTemplate;

    private static final String CACHE_PREFIX = "favorites:";
    private static final Duration CACHE_TTL = Duration.ofMinutes(30);

    @Transactional
    public Favorite addFavorite(Favorite favorite) {
        // Check if already exists
        if (repository.existsByUserIdAndPropertyIdAndPropertyType(
                favorite.getUserId(), favorite.getPropertyId(), favorite.getPropertyType())) {
            throw new IllegalArgumentException("Property already in favorites");
        }
        
        Favorite saved = repository.save(favorite);
        invalidateUserCache(favorite.getUserId());
        log.info("Added favorite for user {} and property {}", favorite.getUserId(), favorite.getPropertyId());
        return saved;
    }

    @Transactional
    public void removeFavorite(String userId, String propertyId, String propertyType) {
        repository.deleteByUserIdAndPropertyIdAndPropertyType(userId, propertyId, propertyType);
        invalidateUserCache(userId);
        log.info("Removed favorite for user {} and property {}", userId, propertyId);
    }

    public List<Favorite> getUserFavorites(String userId) {
        // Try cache first
        String cacheKey = CACHE_PREFIX + userId;
        @SuppressWarnings("unchecked")
        List<Favorite> cached = (List<Favorite>) redisTemplate.opsForValue().get(cacheKey);
        
        if (cached != null) {
            return cached;
        }
        
        // Fetch from database
        List<Favorite> favorites = repository.findByUserIdOrderByCreatedAtDesc(userId);
        
        // Cache the result
        redisTemplate.opsForValue().set(cacheKey, favorites, CACHE_TTL);
        
        return favorites;
    }

    public List<Favorite> getUserFavoritesByType(String userId, String propertyType) {
        return repository.findByUserIdAndPropertyType(userId, propertyType);
    }

    public Optional<Favorite> getFavorite(String userId, String propertyId, String propertyType) {
        return repository.findByUserIdAndPropertyIdAndPropertyType(userId, propertyId, propertyType);
    }

    public boolean isFavorite(String userId, String propertyId, String propertyType) {
        return repository.existsByUserIdAndPropertyIdAndPropertyType(userId, propertyId, propertyType);
    }

    private void invalidateUserCache(String userId) {
        String cacheKey = CACHE_PREFIX + userId;
        redisTemplate.delete(cacheKey);
    }
}
