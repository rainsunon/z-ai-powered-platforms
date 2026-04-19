package com.gridbooks.infrastructure.persistence.entity;

import com.gridbooks.domain.model.Invoice;
import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import org.hibernate.annotations.Type;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "invoices")
@Data
public class InvoiceEntity {
    @Id
    private String id;
    private String description;
    private LocalDate date;
    private LocalDate dueDate;
    private BigDecimal amount;
    private String status;
    private String clientId;

    @Type(JsonType.class)
    @Column(columnDefinition = "jsonb")
    private List<Invoice.LineItem> lineItems;
}
