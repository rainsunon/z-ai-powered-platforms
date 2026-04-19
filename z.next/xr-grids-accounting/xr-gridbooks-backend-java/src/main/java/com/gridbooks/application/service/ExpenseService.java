package com.gridbooks.application.service;

import com.gridbooks.domain.model.Expense;
import com.gridbooks.domain.repository.ExpenseRepository;
import com.gridbooks.infrastructure.persistence.repository.JpaExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final JpaExpenseRepository jpaExpenseRepository;

    @Transactional(readOnly = true)
    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Expense getExpenseById(String id) {
        return expenseRepository.findById(id).orElseThrow(() -> new RuntimeException("Expense not found"));
    }

    @Transactional
    public Expense createExpense(Expense expense) {
        if (expense.getId() == null) {
            expense.setId(UUID.randomUUID().toString());
        }
        return expenseRepository.save(expense);
    }

    /**
     * Find expenses by JSONB metadata using PostgreSQL containment operator
     * Example: findByMetadata("{\"receiptName\": \"receipt.pdf\"}")
     */
    @Transactional(readOnly = true)
    public List<Expense> findByMetadata(String jsonFilter) {
        return jpaExpenseRepository.findByMetadataContaining(jsonFilter)
                .stream()
                .map(this::mapToExpense)
                .collect(Collectors.toList());
    }

    /**
     * Find expenses that have a specific metadata key
     */
    @Transactional(readOnly = true)
    public List<Expense> findByMetadataKey(String key) {
        return jpaExpenseRepository.findByMetadataKeyExists(key)
                .stream()
                .map(this::mapToExpense)
                .collect(Collectors.toList());
    }

    private Expense mapToExpense(com.gridbooks.infrastructure.persistence.entity.ExpenseEntity entity) {
        return Expense.builder()
                .id(entity.getId())
                .date(entity.getDate())
                .merchant(entity.getMerchant())
                .category(entity.getCategory())
                .amount(entity.getAmount())
                .status(entity.getStatus())
                .member(entity.getMember())
                .claimedAt(entity.getClaimedAt())
                .memo(entity.getMemo())
                .approvedBy(entity.getApprovedBy())
                .metadata(entity.getMetadata())
                .build();
    }
}
