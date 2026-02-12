package com.healthcare.ai.common.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Metadata for search results
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchMetadata {

    private Integer totalCandidates;
    private Integer filteredCandidates;
    private Long retrievalTimeMs;
}
