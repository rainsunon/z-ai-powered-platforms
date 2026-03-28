package com.xrs.immo.domain.repository;

import com.xrs.immo.domain.model.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, UUID> {

    List<Favorite> findByUserIdOrderByCreatedAtDesc(String userId);

    Optional<Favorite> findByUserIdAndPropertyIdAndPropertyType(String userId, String propertyId, String propertyType);

    List<Favorite> findByUserIdAndPropertyType(String userId, String propertyType);

    boolean existsByUserIdAndPropertyIdAndPropertyType(String userId, String propertyId, String propertyType);

    void deleteByUserIdAndPropertyIdAndPropertyType(String userId, String propertyId, String propertyType);
}
