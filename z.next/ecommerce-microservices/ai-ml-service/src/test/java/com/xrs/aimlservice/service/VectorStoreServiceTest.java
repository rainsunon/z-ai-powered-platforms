package com.xrs.aimlservice.service;

import com.xrs.aimlservice.dto.AiMlDto;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
class VectorStoreServiceTest {

    @Autowired
    private VectorStoreService vectorStoreService;

    @Test
    void shouldUpsertAndSearchBySemanticSimilarity() {
        vectorStoreService.upsert("doc-1", "red shoes for running", Map.of("category", "shoes"));
        vectorStoreService.upsert("doc-2", "wireless gaming mouse", Map.of("category", "accessory"));

        assertEquals(2, vectorStoreService.size());

        AiMlDto.VectorMatch top = vectorStoreService.search("running shoes", 1).getFirst();
        assertFalse(top.id().isBlank());
    }

    @Test
    void shouldReturnEmptyListWhenStoreIsEmpty() {
        var results = vectorStoreService.search("any query", 5);
        assertTrue(results.isEmpty());
    }

    @Test
    void shouldLimitSearchResultsToTopK() {
        vectorStoreService.upsert("doc-1", "first document", Map.of());
        vectorStoreService.upsert("doc-2", "second document", Map.of());
        vectorStoreService.upsert("doc-3", "third document", Map.of());

        var results = vectorStoreService.search("document", 2);
        assertEquals(2, results.size());
    }

    @Test
    void shouldHandleEmptyMetadata() {
        vectorStoreService.upsert("doc-empty", "test document", null);

        var results = vectorStoreService.search("test", 1);
        assertEquals(1, results.size());
        assertNotNull(results.getFirst().metadata());
    }
}