package com.healthcare.ai.common.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Single plan recommendation
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Recommendation {

    private String planId;
    private String planName;
    private Double matchScore;
    private String reasoning;
    private List<Citation> citations;
}
