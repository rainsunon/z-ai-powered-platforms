package com.gridbooks.application.service;

import com.gridbooks.domain.model.Client;
import com.gridbooks.domain.repository.ClientRepository;
import com.gridbooks.infrastructure.persistence.repository.JpaClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClientService {

    private final ClientRepository clientRepository;
    private final JpaClientRepository jpaClientRepository;

    @Transactional(readOnly = true)
    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Client getClientById(String id) {
        return clientRepository.findById(id).orElseThrow(() -> new RuntimeException("Client not found"));
    }

    @Transactional
    public Client createClient(Client client) {
        if (client.getId() == null) {
            client.setId(UUID.randomUUID().toString());
        }
        return clientRepository.save(client);
    }

    /**
     * Find clients by JSONB preferences using PostgreSQL containment operator
     * Example: findByPreferences("{\"theme\": \"dark\"}")
     */
    @Transactional(readOnly = true)
    public List<Client> findByPreferences(String jsonFilter) {
        return jpaClientRepository.findByPreferencesContaining(jsonFilter)
                .stream()
                .map(this::mapToClient)
                .collect(Collectors.toList());
    }

    /**
     * Find clients who have a specific preference key set
     */
    @Transactional(readOnly = true)
    public List<Client> findByPreferenceKey(String key) {
        return jpaClientRepository.findByPreferenceKeyExists(key)
                .stream()
                .map(this::mapToClient)
                .collect(Collectors.toList());
    }

    private Client mapToClient(com.gridbooks.infrastructure.persistence.entity.ClientEntity entity) {
        return Client.builder()
                .id(entity.getId())
                .name(entity.getName())
                .initials(entity.getInitials())
                .color(entity.getColor())
                .email(entity.getEmail())
                .mobile(entity.getMobile())
                .firstName(entity.getFirstName())
                .lastName(entity.getLastName())
                .gender(entity.getGender())
                .memberTime(entity.getMemberTime())
                .preferences(entity.getPreferences())
                .build();
    }
}
