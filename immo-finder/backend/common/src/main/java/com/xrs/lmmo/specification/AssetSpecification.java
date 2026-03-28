package com.xrs.asset.specification;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import com.xrs.asset.dto.AssignedAssetFilterDTO;
import com.xrs.asset.entity.Asset;
import com.xrs.asset.entity.AssetAssignment;
import com.xrs.asset.entity.User;
import com.xrs.asset.enums.AssetStatus;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class AssetSpecification {
    public static Specification<Asset> availableByType(String type) {
        return (root, query, cb) -> {
            if (type == null || type.isBlank()) {
                return cb.equal(root.get("status"), AssetStatus.AVAILABLE);
            }
            return cb.and(
                    cb.equal(root.get("status"), AssetStatus.AVAILABLE),
                    cb.equal(root.join("type").get("name"), type)
            );
        };
    }

    public static Specification<Asset> buildSpecification(
            AssignedAssetFilterDTO filter, User currentUser) {

        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            Join<Asset, AssetAssignment> assignmentJoin = root.join("assignments", JoinType.LEFT);
            Join<AssetAssignment, User> userJoin = assignmentJoin.join("assignedTo", JoinType.LEFT);
            String role = currentUser.getRole().getName();
            if (filter.isMyAssetsFlag()) {
                predicates.add(cb.equal(userJoin.get("id"), currentUser.getId()));
                filter.setDepartment(null);
                filter.setAssignedUser(null);
            } else {
                switch (role) {
                    case "DEPARTMENT_MANAGER":
                        predicates.add(cb.equal(userJoin.get("department").get("id"), currentUser.getDepartment().getId()));
                        filter.setDepartment(null);
                        break;
                    case "EMPLOYEE":
                        filter.setAssignedUser(currentUser.getUsername());
                        filter.setDepartment(null);
                        break;
                    case "IT":
                        predicates.add(cb.equal(root.get("status"), AssetStatus.UNDER_MAINTENANCE.name()));
                        filter.setStatus(null);
                        break;
                }
            }

            // Add normal filters
            if (filter.getAssetName() != null && !filter.getAssetName().isBlank()) {
                predicates.add(cb.like(root.get("name"), "%" + filter.getAssetName() + "%"));
            }
            if (filter.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), filter.getStatus()));
            }
            if (filter.getType() != null && !filter.getType().isBlank()) {
                predicates.add(cb.equal(root.get("type").get("name"), filter.getType()));
            }
            if (filter.getCategory() != null && !filter.getCategory().isBlank()) {
                predicates.add(cb.like(root.get("category").get("name"), "%" + filter.getCategory() + "%"));
            }
            if (filter.getBrand() != null && !filter.getBrand().isBlank()) {
                predicates.add(cb.equal(root.get("brand"), filter.getBrand()));
            }
            if (filter.getAssignedUser() != null && !filter.getAssignedUser().isBlank()) {
                predicates.add(cb.like(userJoin.get("username"), "%" + filter.getAssignedUser() + "%"));
            }
            if (filter.getDepartment() != null && !filter.getDepartment().isBlank()) {
                predicates.add(cb.equal(userJoin.get("department").get("name"), filter.getDepartment()));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
