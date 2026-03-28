package com.xrs.immo.domain.repository;

import com.xrs.immo.domain.model.Photo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PhotoRepository extends JpaRepository<Photo, UUID> {

    List<Photo> findByPropertyIdOrderByDisplayOrderAsc(String propertyId);

    List<Photo> findByPropertyIdAndPropertyTypeOrderByDisplayOrderAsc(String propertyId, String propertyType);

    List<Photo> findByPropertyIdAndCategoryOrderByDisplayOrderAsc(String propertyId, String category);

    Optional<Photo> findByPropertyIdAndIsPrimaryTrue(String propertyId);

    List<Photo> findByPropertyIdAndPropertyTypeAndCategoryOrderByDisplayOrderAsc(
            String propertyId, String propertyType, String category);

    void deleteByPropertyId(String propertyId);
}
