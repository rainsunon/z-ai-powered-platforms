package com.gridbooks.infrastructure.persistence.repository;

import com.gridbooks.domain.model.Client;
import com.gridbooks.domain.repository.ClientRepository;
import com.gridbooks.infrastructure.persistence.entity.ClientEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class InfrastructureClientRepository implements ClientRepository {

    private final JpaClientRepository jpaRepository;

    @Override
    public Client save(Client client) {
        ClientEntity entity = new ClientEntity();
        mapToEntity(client, entity);
        return mapToDomain(jpaRepository.save(entity));
    }

    @Override
    public Optional<Client> findById(String id) {
        return jpaRepository.findById(id).map(this::mapToDomain);
    }

    @Override
    public List<Client> findAll() {
        return jpaRepository.findAll().stream().map(this::mapToDomain).collect(Collectors.toList());
    }

    private Client mapToDomain(ClientEntity entity) {
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

    private void mapToEntity(Client client, ClientEntity entity) {
        entity.setId(client.getId());
        entity.setName(client.getName());
        entity.setInitials(client.getInitials());
        entity.setColor(client.getColor());
        entity.setEmail(client.getEmail());
        entity.setMobile(client.getMobile());
        entity.setFirstName(client.getFirstName());
        entity.setLastName(client.getLastName());
        entity.setGender(client.getGender());
        entity.setMemberTime(client.getMemberTime());
        entity.setPreferences(client.getPreferences());
    }
}
