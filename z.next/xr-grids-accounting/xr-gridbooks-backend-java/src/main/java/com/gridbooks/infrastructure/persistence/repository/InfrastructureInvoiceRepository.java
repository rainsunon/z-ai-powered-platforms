package com.gridbooks.infrastructure.persistence.repository;

import com.gridbooks.domain.model.Invoice;
import com.gridbooks.domain.repository.InvoiceRepository;
import com.gridbooks.infrastructure.persistence.entity.InvoiceEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class InfrastructureInvoiceRepository implements InvoiceRepository {

    private final JpaInvoiceRepository jpaRepository;

    @Override
    public Invoice save(Invoice invoice) {
        InvoiceEntity entity = new InvoiceEntity();
        mapToEntity(invoice, entity);
        return mapToDomain(jpaRepository.save(entity));
    }

    @Override
    public Optional<Invoice> findById(String id) {
        return jpaRepository.findById(id).map(this::mapToDomain);
    }

    @Override
    public List<Invoice> findAll() {
        return jpaRepository.findAll().stream().map(this::mapToDomain).collect(Collectors.toList());
    }

    @Override
    public List<Invoice> findByClientId(String clientId) {
        return jpaRepository.findByClientId(clientId).stream().map(this::mapToDomain).collect(Collectors.toList());
    }

    private Invoice mapToDomain(InvoiceEntity entity) {
        return Invoice.builder()
                .id(entity.getId())
                .description(entity.getDescription())
                .date(entity.getDate())
                .dueDate(entity.getDueDate())
                .amount(entity.getAmount())
                .status(entity.getStatus())
                .clientId(entity.getClientId())
                .lineItems(entity.getLineItems())
                .build();
    }

    private void mapToEntity(Invoice invoice, InvoiceEntity entity) {
        entity.setId(invoice.getId());
        entity.setDescription(invoice.getDescription());
        entity.setDate(invoice.getDate());
        entity.setDueDate(invoice.getDueDate());
        entity.setAmount(invoice.getAmount());
        entity.setStatus(invoice.getStatus());
        entity.setClientId(invoice.getClientId());
        entity.setLineItems(invoice.getLineItems());
    }
}
