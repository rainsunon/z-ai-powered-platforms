package com.xrs.immo.domain.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "audit_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {
    @Id
    private String id; // We will use the event ID as the document ID for idempotence
    
    private String eventType;
    private String aggregateId;
    private String payload;
    private LocalDateTime processedAt;
}
