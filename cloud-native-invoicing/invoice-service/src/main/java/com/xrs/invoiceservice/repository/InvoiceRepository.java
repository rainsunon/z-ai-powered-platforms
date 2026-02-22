package com.xrs.invoiceservice.repository;

import com.xrs.invoiceservice.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findByClientId(String clientId);
}
