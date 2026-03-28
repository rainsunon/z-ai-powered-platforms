package com.xrs.asset.specification;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import com.xrs.asset.entity.AssetRequest;
import com.xrs.asset.dto.requestAsset.RequestFilter;
import com.xrs.asset.entity.User;
import com.xrs.asset.enums.RequestStatus;
import com.xrs.asset.enums.RequestType;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class RequestSpecifications {

    public static Specification<AssetRequest> byReqType(RequestType type){
        return(root,query,cb)->
                cb.equal(root.get("requestType"),type);
    }
    public static Specification<AssetRequest> byStatuses(List<RequestStatus> statuses) {
        return (root, query, cb) -> {
            if (statuses == null || statuses.isEmpty()) {
                return cb.conjunction();
            }
            return root.get("status").in(statuses);
        };
    }


    public static Specification<AssetRequest> withFilter(RequestFilter filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (filter.getStatus() != null) {
                if (filter.getStatus().equalsIgnoreCase("PAST")) {
                    predicates.add(root.get("status").in(RequestStatus.APPROVED, RequestStatus.REJECTED));
                } else {
                    predicates.add(cb.equal(root.get("status"), RequestStatus.valueOf(filter.getStatus())));
                }
            }
            if (filter.getType() != null) {
                predicates.add(cb.equal(root.get("requestType"), filter.getType()));
            }
            if (filter.getDepartmentId() != null) {
                predicates.add(cb.equal(root.join("requester").join("department").get("id"), filter.getDepartmentId()));
            }
            if (filter.getSearch() != null && !filter.getSearch().trim().isEmpty()) {
                String likePattern = "%" + filter.getSearch().trim().toLowerCase() + "%";
                predicates.add(
                        cb.or(
                                cb.like(cb.lower(root.join("assetType", JoinType.LEFT).get("name")), likePattern),
                                cb.like(cb.lower(root.join("asset", JoinType.LEFT).get("name")), likePattern),
                                cb.like(cb.lower(root.join("requester", JoinType.LEFT).get("username")), likePattern),
                                cb.like(cb.lower(root.join("requester", JoinType.LEFT).get("email")), likePattern)
                        )
                );
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    public static Specification<AssetRequest> requestedFor(Long userId) {
        return (root, query, cb) -> cb.equal(root.get("requester").get("id"), userId);
    }

    public static Specification<AssetRequest> typeEquals(RequestType type) {
        return (root, query, cb) -> cb.equal(root.get("requestType"), type);

    }
    public static Specification<AssetRequest> buildRoleBasedSpecification(User currentUser, RequestFilter filter) {
        String roleName = currentUser.getRole().getName();

        if (roleName.equals("ADMIN")) {
            return RequestSpecifications.withFilter(filter);
        } else if (roleName.equals("IT")) {
            return Specification
                    .where(RequestSpecifications.requestedFor(currentUser.getId()))
                    .or(RequestSpecifications.typeEquals(RequestType.MAINTENANCE))
                    .and(RequestSpecifications.withFilter(filter));
        } else {
            return Specification
                    .where(RequestSpecifications.requestedFor(currentUser.getId()))
                    .and(RequestSpecifications.withFilter(filter));
        }
    }
}

