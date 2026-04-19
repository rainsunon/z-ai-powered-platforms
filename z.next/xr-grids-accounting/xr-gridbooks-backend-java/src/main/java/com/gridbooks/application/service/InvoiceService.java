package com.gridbooks.application.service;

import com.gridbooks.domain.model.Invoice;
import com.gridbooks.domain.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;

    @Transactional(readOnly = true)
    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Invoice> getInvoicesByClient(String clientId) {
        return invoiceRepository.findByClientId(clientId);
    }

    @Transactional(readOnly = true)
    public Invoice getInvoiceById(String id) {
        return invoiceRepository.findById(id).orElseThrow(() -> new RuntimeException("Invoice not found"));
    }

    @Transactional
    public Invoice createInvoice(Invoice invoice) {
        if (invoice.getId() == null) {
            invoice.setId(UUID.randomUUID().toString());
        }
        return invoiceRepository.save(invoice);
    }
}
