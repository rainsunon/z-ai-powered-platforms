package com.gridbooks.domain.model;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class Invoice {
    private String id;
    private String description;
    private LocalDate date;
    private LocalDate dueDate;
    private BigDecimal amount;
    private String status;
    private String clientId;

    // JSONB content
    private List<LineItem> lineItems;

    @Data
    @Builder
    public static class LineItem {
        private String description;
        private Integer quantity;
        private BigDecimal rate;
        private BigDecimal amount;
    }
}
