package com.xrs.immo.infrastructure.messaging;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.xrs.immo.domain.model.PropertyDocument;
import com.xrs.immo.domain.repository.PropertySearchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
@Slf4j
public class PropertyEventListener {

    private final PropertySearchRepository repository;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "buy-property-events", groupId = "search-service-group")
    public void handleBuyPropertyEvent(String payload) {
        try {
            JsonNode node = objectMapper.readTree(payload);
            PropertyDocument doc = PropertyDocument.builder()
                    .id(node.get("id").asText())
                    .title(node.get("title").asText())
                    .price(new BigDecimal(node.get("price").asText()))
                    .rooms(node.get("rooms").asInt())
                    .size(node.get("size").asDouble())
                    .type("BUY")
                    .status(node.get("status").asText())
                    .build();
            repository.save(doc);
            log.info("Indexed buy property: {}", doc.getId());
        } catch (Exception e) {
            log.error("Failed to process buy property event", e);
        }
    }
}
