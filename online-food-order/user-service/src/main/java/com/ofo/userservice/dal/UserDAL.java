package com.ofo.userservice.dal;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ofo.userservice.model.User;

/**
 * This interface to perform the CRUD operations on User Object in MySQL DB
 *
 */
@Repository
public interface UserDAL extends JpaRepository<User, Long> {

}
