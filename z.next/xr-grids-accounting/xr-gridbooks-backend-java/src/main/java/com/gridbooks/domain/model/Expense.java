package com.gridbooks.domain.model;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.Map;

@Data
@Builder
public class Expense {
    private String id;
    private LocalDate date;
    private String merchant;
    private String category;
    private BigDecimal amount;
    private String status;
    private String member;
    private LocalDateTime claimedAt;
    private String memo;
    private String approvedBy;

    // JSONB content
    private Map<String, Object> metadata;
}
