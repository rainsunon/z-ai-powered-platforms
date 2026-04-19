package com.gridbooks.infrastructure.persistence.repository;

import com.gridbooks.infrastructure.persistence.entity.InvoiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JpaInvoiceRepository extends JpaRepository<InvoiceEntity, String> {
    List<InvoiceEntity> findByClientId(String clientId);
}
