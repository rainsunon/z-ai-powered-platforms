package com.gridbooks.infrastructure.persistence.entity;

import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import org.hibernate.annotations.Type;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "expenses")
@Data
public class ExpenseEntity {
    @Id
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

    @Type(JsonType.class)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> metadata;
}
