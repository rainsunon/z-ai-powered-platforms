package com.xrs.immo.application.command;

import com.xrs.immo.domain.model.BuyProperty;
import com.xrs.immo.domain.model.OutboxEvent;
import com.xrs.immo.domain.repository.BuyPropertyRepository;
import com.xrs.immo.domain.repository.OutboxEventRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class BuyPropertyCommandService {

    private final BuyPropertyRepository buyPropertyRepository;
    private final OutboxEventRepository outboxEventRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public BuyProperty createProperty(BuyProperty property) {
        BuyProperty saved = buyPropertyRepository.save(property);
        
        // Create outbox event
        OutboxEvent outboxEvent = OutboxEvent.builder()
                .aggregateId(saved.getId().toString())
                .eventType("PropertyCreated")
                .payload(serializeProperty(saved))
                .build();
        outboxEventRepository.save(outboxEvent);
        
        log.info("Created buy property with id: {}", saved.getId());
        return saved;
    }

    @Transactional
    public BuyProperty updateProperty(BuyProperty property) {
        if (!buyPropertyRepository.existsById(property.getId())) {
            return null;
        }
        BuyProperty updated = buyPropertyRepository.save(property);
        
        // Create outbox event
        OutboxEvent outboxEvent = OutboxEvent.builder()
                .aggregateId(updated.getId().toString())
                .eventType("PropertyUpdated")
                .payload(serializeProperty(updated))
                .build();
        outboxEventRepository.save(outboxEvent);
        
        log.info("Updated buy property with id: {}", updated.getId());
        return updated;
    }

    @Transactional
    public boolean deleteProperty(UUID id) {
        if (!buyPropertyRepository.existsById(id)) {
            return false;
        }
        buyPropertyRepository.deleteById(id);
        
        // Create outbox event
        OutboxEvent outboxEvent = OutboxEvent.builder()
                .aggregateId(id.toString())
                .eventType("PropertyDeleted")
                .payload("{\"propertyId\":\"" + id + "\"}")
                .build();
        outboxEventRepository.save(outboxEvent);
        
        log.info("Deleted buy property with id: {}", id);
        return true;
    }

    private String serializeProperty(BuyProperty property) {
        try {
            return objectMapper.writeValueAsString(property);
        } catch (Exception e) {
            log.error("Failed to serialize property", e);
            return "{}";
        }
    }
}
