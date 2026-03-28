package com.xrs.immo.application.service;

import com.xrs.immo.domain.model.Photo;
import com.xrs.immo.domain.repository.PhotoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PhotoService {

    private final PhotoRepository repository;

    @Transactional
    public Photo addPhoto(Photo photo) {
        // If this is the first photo or marked as primary, set it as primary
        List<Photo> existingPhotos = repository.findByPropertyIdOrderByDisplayOrderAsc(photo.getPropertyId());
        if (existingPhotos.isEmpty() || photo.getIsPrimary()) {
            // Reset other primary photos
            existingPhotos.forEach(p -> p.setIsPrimary(false));
            photo.setIsPrimary(true);
        }
        
        // Set display order if not provided
        if (photo.getDisplayOrder() == null) {
            photo.setDisplayOrder(existingPhotos.size());
        }
        
        Photo saved = repository.save(photo);
        log.info("Added photo for property {}", photo.getPropertyId());
        return saved;
    }

    @Transactional
    public Photo updatePhoto(Photo photo) {
        Photo existing = repository.findById(photo.getId()).orElse(null);
        if (existing == null) {
            return null;
        }
        
        // If setting as primary, reset other primary photos
        if (photo.getIsPrimary() && !existing.getIsPrimary()) {
            List<Photo> photos = repository.findByPropertyIdOrderByDisplayOrderAsc(photo.getPropertyId());
            photos.forEach(p -> p.setIsPrimary(false));
            repository.saveAll(photos);
        }
        
        Photo updated = repository.save(photo);
        log.info("Updated photo {}", photo.getId());
        return updated;
    }

    @Transactional
    public void deletePhoto(UUID id) {
        Photo photo = repository.findById(id).orElse(null);
        if (photo != null) {
            repository.deleteById(id);
            
            // If this was the primary photo, set the first remaining photo as primary
            if (photo.getIsPrimary()) {
                List<Photo> remaining = repository.findByPropertyIdOrderByDisplayOrderAsc(photo.getPropertyId());
                if (!remaining.isEmpty()) {
                    remaining.get(0).setIsPrimary(true);
                    repository.save(remaining.get(0));
                }
            }
            
            log.info("Deleted photo {}", id);
        }
    }

    @Transactional
    public void deleteAllPhotosForProperty(String propertyId) {
        repository.deleteByPropertyId(propertyId);
        log.info("Deleted all photos for property {}", propertyId);
    }

    public List<Photo> getPhotosByPropertyId(String propertyId) {
        return repository.findByPropertyIdOrderByDisplayOrderAsc(propertyId);
    }

    public List<Photo> getPhotosByPropertyIdAndType(String propertyId, String propertyType) {
        return repository.findByPropertyIdAndPropertyTypeOrderByDisplayOrderAsc(propertyId, propertyType);
    }

    public List<Photo> getPhotosByPropertyIdAndCategory(String propertyId, String category) {
        return repository.findByPropertyIdAndCategoryOrderByDisplayOrderAsc(propertyId, category);
    }

    public Optional<Photo> getPrimaryPhoto(String propertyId) {
        return repository.findByPropertyIdAndIsPrimaryTrue(propertyId);
    }

    public Photo getPhotoById(UUID id) {
        return repository.findById(id).orElse(null);
    }
}
