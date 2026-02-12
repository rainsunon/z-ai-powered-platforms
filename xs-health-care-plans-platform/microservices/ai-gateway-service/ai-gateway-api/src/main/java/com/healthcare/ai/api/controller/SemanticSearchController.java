package com.healthcare.ai.api.controller;

import com.healthcare.ai.common.dto.request.SearchRequest;
import com.healthcare.ai.common.dto.response.SearchResponse;
import com.healthcare.ai.service.SemanticSearchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Semantic Search Controller
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
@Tag(name = "Semantic Search", description = "AI-powered semantic search for healthcare plans")
public class SemanticSearchController {

    private final SemanticSearchService semanticSearchService;

    @PostMapping("/search")
    @Operation(summary = "Semantic plan search", description = "Search for healthcare plans using natural language queries")
    public ResponseEntity<SearchResponse> search(@Valid @RequestBody SearchRequest request) {
        log.info("Received semantic search request: query='{}'", request.getQuery());
        SearchResponse response = semanticSearchService.search(request);
        return ResponseEntity.ok(response);
    }
}
