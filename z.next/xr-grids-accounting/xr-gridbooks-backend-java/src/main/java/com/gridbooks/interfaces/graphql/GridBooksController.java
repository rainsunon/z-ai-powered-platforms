package com.gridbooks.interfaces.graphql;

import com.gridbooks.application.service.ClientService;
import com.gridbooks.application.service.ExpenseService;
import com.gridbooks.application.service.InvoiceService;
import com.gridbooks.domain.model.Client;
import com.gridbooks.domain.model.Expense;
import com.gridbooks.domain.model.Invoice;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class GridBooksController {

    private final ClientService clientService;
    private final ExpenseService expenseService;
    private final InvoiceService invoiceService;

    // --- Clients ---
    @QueryMapping
    public List<Client> clients() {
        return clientService.getAllClients();
    }

    @QueryMapping
    public Client client(@Argument String id) {
        return clientService.getClientById(id);
    }

    @MutationMapping
    public Client createClient(@Argument Client input) {
        return clientService.createClient(input);
    }

    // --- Expenses ---
    @QueryMapping
    public List<Expense> expenses() {
        return expenseService.getAllExpenses();
    }

    @QueryMapping
    public Expense expense(@Argument String id) {
        return expenseService.getExpenseById(id);
    }

    @MutationMapping
    public Expense createExpense(@Argument Expense input) {
        return expenseService.createExpense(input);
    }

    // --- Invoices ---
    @QueryMapping
    public List<Invoice> invoices() {
        return invoiceService.getAllInvoices();
    }

    @QueryMapping
    public List<Invoice> invoicesByClient(@Argument String clientId) {
        return invoiceService.getInvoicesByClient(clientId);
    }

    @QueryMapping
    public Invoice invoice(@Argument String id) {
        return invoiceService.getInvoiceById(id);
    }

    @MutationMapping
    public Invoice createInvoice(@Argument Invoice input) {
        return invoiceService.createInvoice(input);
    }
}
