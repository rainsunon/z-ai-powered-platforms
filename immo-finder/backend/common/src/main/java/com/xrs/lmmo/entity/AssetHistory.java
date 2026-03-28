package com.xrs.asset.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

import com.xrs.asset.entity.AssetStatus;

@Entity
@Table(name = "asset_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AssetHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "asset_id", nullable = false)
    private Asset asset;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(columnDefinition = "TEXT")
    private String note;

    private LocalDateTime timestamp;

    @Enumerated(EnumType.STRING)
    private AssetStatus status;
}
