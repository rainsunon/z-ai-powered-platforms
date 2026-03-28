package com.xrs.asset.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

import com.xrs.asset.enums.RequestStatus;
import com.xrs.asset.enums.RequestType;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "asset_request")
public class AssetRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "asset_id")
    private Asset asset;

    @ManyToOne(optional = false)
    @JoinColumn(name = "type_id", nullable = false)
    private AssetType assetType;

    @ManyToOne(optional = false)
    @JoinColumn(name = "requester_id", nullable = false)
    private User requester;

    @Column(name="request_date")
    private LocalDateTime requestDate;

    @Enumerated(EnumType.STRING)
    private RequestStatus status;

    @Enumerated(EnumType.STRING)
    private RequestType requestType;

    @ManyToOne
    @JoinColumn(name = "approved_by_id")
    private User approvedBy;

    @Column(name="approved_date")
    private LocalDateTime approvedDate;

    @Column(name="note")
    private String note;

    @Column(name="rejection_note")
    private String rejectionNote;
}