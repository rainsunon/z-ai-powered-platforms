package com.xrs.asset.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

import com.xrs.asset.enums.AssignmentStatus;

@Entity
@Table(name = "asset_assignment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class    AssetAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false,fetch = FetchType.LAZY)
    @JoinColumn(name = "asset_id", nullable = false)
    @JsonBackReference
    private Asset asset;

    @ManyToOne(optional = false,fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to_user_id", nullable = false)
    private User assignedTo;

    @NotNull
    @Column(nullable = false,name = "assignment_date")
    private LocalDate assignmentDate; //how to make the mapper make todays date by default

    @NotNull
    @Column(nullable = false,name = "status")
    @Enumerated(EnumType.STRING)
    private AssignmentStatus status;

    @Column(columnDefinition = "TEXT")
    private String note;
}