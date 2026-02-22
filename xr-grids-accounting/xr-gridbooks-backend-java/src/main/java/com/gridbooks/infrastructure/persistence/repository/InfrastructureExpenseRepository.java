package com.gridbooks.infrastructure.persistence.repository;

import com.gridbooks.domain.model.Expense;
import com.gridbooks.domain.repository.ExpenseRepository;
import com.gridbooks.infrastructure.persistence.entity.ExpenseEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class InfrastructureExpenseRepository implements ExpenseRepository {

    private final JpaExpenseRepository jpaRepository;

    @Override
    public Expense save(Expense expense) {
        ExpenseEntity entity = new ExpenseEntity();
        mapToEntity(expense, entity);
        return mapToDomain(jpaRepository.save(entity));
    }

    @Override
    public Optional<Expense> findById(String id) {
        return jpaRepository.findById(id).map(this::mapToDomain);
    }

    @Override
    public List<Expense> findAll() {
        return jpaRepository.findAll().stream().map(this::mapToDomain).collect(Collectors.toList());
    }

    private Expense mapToDomain(ExpenseEntity entity) {
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

    private void mapToEntity(Expense expense, ExpenseEntity entity) {
        entity.setId(expense.getId());
        entity.setDate(expense.getDate());
        entity.setMerchant(expense.getMerchant());
        entity.setCategory(expense.getCategory());
        entity.setAmount(expense.getAmount());
        entity.setStatus(expense.getStatus());
        entity.setMember(expense.getMember());
        entity.setClaimedAt(expense.getClaimedAt());
        entity.setMemo(expense.getMemo());
        entity.setApprovedBy(expense.getApprovedBy());
        entity.setMetadata(expense.getMetadata());
    }
}
