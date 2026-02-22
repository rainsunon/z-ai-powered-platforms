package com.gridbooks.infrastructure.persistence.repository;

import com.gridbooks.infrastructure.persistence.entity.ExpenseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JpaExpenseRepository extends JpaRepository<ExpenseEntity, String> {

    /**
     * Find expenses by category using JSONB containment operator (@>)
     * This demonstrates advanced PostgreSQL JSONB querying
     */
    @Query(value = "SELECT * FROM expenses WHERE metadata @> CAST(:filter AS jsonb)", nativeQuery = true)
    List<ExpenseEntity> findByMetadataContaining(@Param("filter") String jsonFilter);

    /**
     * Find expenses where metadata has a specific key
     * Uses the ? operator for key existence check
     */
    @Query(value = "SELECT * FROM expenses WHERE metadata ?? :key", nativeQuery = true)
    List<ExpenseEntity> findByMetadataKeyExists(@Param("key") String key);
}
