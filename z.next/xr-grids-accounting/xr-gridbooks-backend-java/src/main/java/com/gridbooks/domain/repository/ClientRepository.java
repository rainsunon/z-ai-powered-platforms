package com.gridbooks.domain.repository;

import com.gridbooks.domain.model.Client;
import java.util.List;
import java.util.Optional;

public interface ClientRepository {
    Client save(Client client);

    Optional<Client> findById(String id);

    List<Client> findAll();
}
