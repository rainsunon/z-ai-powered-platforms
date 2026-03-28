package com.xrs.immo.domain.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "property_view_events", indexes = {
    @Index(name = "idx_property_id", columnList = "property_id"),
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_event_date", columnList = "event_date")
})
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropertyViewEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "property_id", nullable = false)
    private String propertyId;

    @Column(name = "property_type", nullable = false)
    private String propertyType; // RENT, BUY

    @Column(name = "user_id")
    private String userId;

    @Column(name = "session_id")
    private String sessionId;

    @Column(name = "event_date", nullable = false)
    private LocalDateTime eventDate;

    @Column(name = "duration_seconds")
    private Integer durationSeconds;

    @Column(name = "source", length = 50)
    private String source; // WEB, MOBILE, API

    @Column(name = "referrer")
    private String referrer;

    @Column(name = "user_agent")
    private String userAgent;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "created_at", updatable = false)
    @CreatedDate
    private LocalDateTime createdAt;
}
