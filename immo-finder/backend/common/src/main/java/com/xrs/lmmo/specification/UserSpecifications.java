package com.xrs.asset.specification;

import com.xrs.asset.entity.User;
import org.springframework.data.jpa.domain.Specification;

public class UserSpecifications {

    public static Specification<User> hasNameOrEmail(String searchWord) {
        return (root, query, cb) ->{
            return  cb.or(
                    cb.like(cb.lower(root.get("username")), "%" + searchWord.toLowerCase() + "%"),
                    cb.like(cb.lower(root.get("email")), "%" + searchWord.toLowerCase() + "%")
            );
        };

    }

    public static Specification<User> hasRole(String role) {
        return (root, query, cb) ->
                cb.equal(root.get("role").get("name"), role);
    }
    public static Specification<User> inDepartment(Long departmentId) {
        return (root, query, cb) ->
                cb.equal(root.get("department").get("id"), departmentId);
    }
}
