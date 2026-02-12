package com.healthcare.ai.common.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Citation for evidence-backed responses
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Citation {

    private String ref;
    private String value;
}
