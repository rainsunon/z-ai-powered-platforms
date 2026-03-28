package com.xrs.immo.application.service;

import com.xrs.immo.domain.model.PropertyViewEvent;
import com.xrs.immo.domain.repository.PropertyViewEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnalyticsService {

    private final PropertyViewEventRepository repository;

    @Transactional
    public PropertyViewEvent recordView(PropertyViewEvent event) {
        if (event.getEventDate() == null) {
            event.setEventDate(LocalDateTime.now());
        }
        PropertyViewEvent saved = repository.save(event);
        log.info("Recorded view event for property {} by user {}", 
                 event.getPropertyId(), event.getUserId());
        return saved;
    }

    @Transactional
    public void recordView(String propertyId, String propertyType, String userId, 
                          String sessionId, String source, String referrer, 
                          String userAgent, String ipAddress) {
        PropertyViewEvent event = PropertyViewEvent.builder()
                .propertyId(propertyId)
                .propertyType(propertyType)
                .userId(userId)
                .sessionId(sessionId)
                .eventDate(LocalDateTime.now())
                .source(source)
                .referrer(referrer)
                .userAgent(userAgent)
                .ipAddress(ipAddress)
                .build();
        recordView(event);
    }

    public List<PropertyViewEvent> getPropertyViews(String propertyId) {
        return repository.findByPropertyIdOrderByEventDateDesc(propertyId);
    }

    public List<PropertyViewEvent> getUserViews(String userId) {
        return repository.findByUserIdOrderByEventDateDesc(userId);
    }

    public long getPropertyViewCount(String propertyId, LocalDateTime since) {
        return repository.countViewsByPropertyIdSince(propertyId, since);
    }

    public long getUniqueViewerCount(String propertyId, LocalDateTime since) {
        return repository.countUniqueViewersByPropertyIdSince(propertyId, since);
    }

    public List<Map<String, Object>> getMostViewedProperties(LocalDateTime startDate, LocalDateTime endDate) {
        return repository.findMostViewedPropertiesBetween(startDate, endDate)
                .stream()
                .map(row -> Map.of(
                    "propertyId", row[0],
                    "viewCount", row[1]
                ))
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getViewsByPropertyType(LocalDateTime startDate, LocalDateTime endDate) {
        return repository.countViewsByPropertyTypeBetween(startDate, endDate)
                .stream()
                .map(row -> Map.of(
                    "propertyType", row[0],
                    "viewCount", row[1]
                ))
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getViewsByDate(LocalDateTime startDate, LocalDateTime endDate) {
        return repository.countViewsByDateBetween(startDate, endDate)
                .stream()
                .map(row -> Map.of(
                    "date", row[0],
                    "viewCount", row[1]
                ))
                .collect(Collectors.toList());
    }

    public Map<String, Object> getPropertyAnalytics(String propertyId, LocalDateTime since) {
        long totalViews = getPropertyViewCount(propertyId, since);
        long uniqueViewers = getUniqueViewerCount(propertyId, since);
        
        return Map.of(
            "propertyId", propertyId,
            "totalViews", totalViews,
            "uniqueViewers", uniqueViewers,
            "since", since
        );
    }
}
