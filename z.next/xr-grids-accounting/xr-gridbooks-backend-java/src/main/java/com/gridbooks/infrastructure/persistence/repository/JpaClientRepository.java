package com.gridbooks.infrastructure.persistence.repository;

import com.gridbooks.infrastructure.persistence.entity.ClientEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JpaClientRepository extends JpaRepository<ClientEntity, String> {

    /**
     * Find clients by preferences using JSONB containment operator
     * Example: findByPreferencesContaining("{\"theme\": \"dark\"}")
     */
    @Query(value = "SELECT * FROM clients WHERE preferences @> CAST(:filter AS jsonb)", nativeQuery = true)
    List<ClientEntity> findByPreferencesContaining(@Param("filter") String jsonFilter);

    /**
     * Find clients where a specific preference key exists
     */
    @Query(value = "SELECT * FROM clients WHERE preferences ?? :key", nativeQuery = true)
    List<ClientEntity> findByPreferenceKeyExists(@Param("key") String key);
}
