package com.github.dimitryivaniuta.audittrail.hash;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import org.springframework.stereotype.Component;

/**
 * Produces a deterministic JSON representation for hashing purposes.
 *
 * <p>Jackson's default serialization depends on {@link Map} iteration order. To make the hash stable
 * across JVMs and runs, this service recursively sorts object keys (maps) and preserves list order.</p>
 *
 * <p>This is not a full RFC-8785 implementation, but it is deterministic for typical audit payloads
 * (nested maps/lists with primitive values).</p>
 */
@Component
public class CanonicalJsonService {

    private final ObjectMapper objectMapper;

    /**
     * Creates the service.
     *
     * @param objectMapper Jackson mapper
     */
    public CanonicalJsonService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    /**
     * Canonicalizes a payload as JSON with recursively sorted map keys.
     *
     * @param payload payload (may be null)
     * @return canonical JSON string
     */
    public String canonicalize(Map<String, Object> payload) {
        Object normalized = normalize(payload != null ? payload : Map.of());
        try {
            return objectMapper.writeValueAsString(normalized);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Invalid data payload; cannot serialize to canonical JSON", e);
        }
    }

    private Object normalize(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof Map<?, ?> m) {
            // Sort keys with a TreeMap and preserve normalized values in a LinkedHashMap.
            TreeMap<String, Object> sorted = new TreeMap<>();
            for (Map.Entry<?, ?> e : m.entrySet()) {
                sorted.put(String.valueOf(e.getKey()), e.getValue());
            }
            LinkedHashMap<String, Object> out = new LinkedHashMap<>();
            for (Map.Entry<String, Object> e : sorted.entrySet()) {
                out.put(e.getKey(), normalize(e.getValue()));
            }
            return out;
        }
        if (value instanceof List<?> list) {
            List<Object> out = new ArrayList<>(list.size());
            for (Object o : list) {
                out.add(normalize(o));
            }
            return out;
        }
        // Primitive / string / number / boolean: keep as-is.
        return value;
    }
}
