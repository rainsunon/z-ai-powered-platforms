package com.gridbooks.domain.repository;

import com.gridbooks.domain.model.Invoice;
import java.util.List;
import java.util.Optional;

public interface InvoiceRepository {
    Invoice save(Invoice invoice);

    Optional<Invoice> findById(String id);

    List<Invoice> findAll();

    List<Invoice> findByClientId(String clientId);
}
