package com.xrs.asset.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "asset_category")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AssetCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String name;

    @Column(length = 200)
    private String description;
}