import { IClientRepository } from '../../../domain/repositories/IClientRepository';
import { ClientDTO } from '../../dtos/ClientDTO';
import { Client } from '../../../domain/entities/Client';

export class ListClientsUseCase {
    constructor(private clientRepository: IClientRepository) { }

    async execute(userId: string): Promise<ClientDTO[]> {
        const clients = await this.clientRepository.findByUserId(userId);
        return clients.map((client) => this.toDTO(client));
    }

    private toDTO(client: Client): ClientDTO {
        return {
            id: client.id,
            userId: client.userId,
            name: client.name,
            contact: client.contact,
            preferences: client.preferences,
            metadata: client.metadata,
            totalOutstanding: client.totalOutstanding.amount,
            credit: client.credit.amount,
            initials: client.getInitials(),
            createdAt: client.createdAt,
            updatedAt: client.updatedAt,
        };
    }
}
