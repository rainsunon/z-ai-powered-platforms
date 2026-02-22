package com.xrs.aimlservice.controller;

import com.xrs.aimlservice.dto.AiMlDto;
import com.xrs.aimlservice.service.IngestPrepService;
import com.xrs.aimlservice.service.VectorStoreService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
public class IngestPrepController {

    private final IngestPrepService ingestPrepService;
    private final VectorStoreService vectorStoreService;

    public IngestPrepController(IngestPrepService ingestPrepService, VectorStoreService vectorStoreService) {
        this.ingestPrepService = ingestPrepService;
        this.vectorStoreService = vectorStoreService;
    }

    @PostMapping("/ingest")
    public AiMlDto.IngestResponse ingest(@Valid @RequestBody AiMlDto.IngestRequest request) {
        return ingestPrepService.ingest(request);
    }

    @PostMapping("/preprocess")
    public AiMlDto.PreprocessResponse preprocess(@RequestBody AiMlDto.PreprocessRequest request) {
        return ingestPrepService.preprocess(request);
    }

    @PostMapping("/vectors/upsert")
    public AiMlDto.VectorUpsertResponse upsert(@Valid @RequestBody AiMlDto.VectorUpsertRequest request) {
        vectorStoreService.upsert(request.id(), request.text(), request.metadata());
        return new AiMlDto.VectorUpsertResponse(request.id(), "UPSERTED");
    }

    @PostMapping("/vectors/search")
    public AiMlDto.VectorSearchResponse search(@Valid @RequestBody AiMlDto.VectorSearchRequest request) {
        int topK = request.topK() == null ? 5 : request.topK();
        return new AiMlDto.VectorSearchResponse(vectorStoreService.search(request.query(), topK));
    }
}