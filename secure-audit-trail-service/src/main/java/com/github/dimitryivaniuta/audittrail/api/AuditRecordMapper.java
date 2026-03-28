package com.github.dimitryivaniuta.audittrail.api;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.dimitryivaniuta.audittrail.api.dto.AuditRecordResponse;
import com.github.dimitryivaniuta.audittrail.domain.AuditRecordEntity;
import java.util.Map;
import org.springframework.stereotype.Component;

/**
 * Maps domain entities to API DTOs.
 */
@Component
public class AuditRecordMapper {

    private static final TypeReference<Map<String, Object>> MAP_TYPE = new TypeReference<>() {};

    private final ObjectMapper objectMapper;

    /**
     * Creates mapper.
     *
     * @param objectMapper mapper
     */
    public AuditRecordMapper(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    /**
     * Converts entity to response.
     *
     * @param e entity
     * @return response
     */
    public AuditRecordResponse toResponse(AuditRecordEntity e) {
        return new AuditRecordResponse(
                e.getId(),
                e.getTenantId(),
                e.getEventId(),
                e.getActor(),
                e.getAction(),
                e.getResourceType(),
                e.getResourceId(),
                e.getCorrelationId(),
                e.getCreatedAt(),
                parseJson(e.getDataJson()),
                e.getHashAlg(),
                e.getKeyId(),
                e.getPrevHash(),
                e.getHash()
        );
    }

    private Map<String, Object> parseJson(String json) {
        try {
            return objectMapper.readValue(json, MAP_TYPE);
        } catch (Exception ex) {
            // Data is stored as JSONB; parsing should succeed. If it doesn't, expose a safe placeholder.
            return Map.of("error", "failed_to_parse_data_json");
        }
    }
}
