package com.gridbooks.domain.repository;

import com.gridbooks.domain.model.Expense;
import java.util.List;
import java.util.Optional;

public interface ExpenseRepository {
    Expense save(Expense expense);

    Optional<Expense> findById(String id);

    List<Expense> findAll();
}
