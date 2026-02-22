import { IClientRepository } from '../../../domain/repositories/IClientRepository';
import { Client } from '../../../domain/entities/Client';
import { Email } from '../../../domain/value-objects/Email';
import { Address } from '../../../domain/value-objects/Address';
import { CreateClientDTO, ClientDTO } from '../../dtos/ClientDTO';

export class CreateClientUseCase {
    constructor(private clientRepository: IClientRepository) { }

    async execute(dto: CreateClientDTO): Promise<ClientDTO> {
        // Validate email
        const email = new Email(dto.email);

        // Create address if provided
        const address = dto.address ? new Address(dto.address) : undefined;

        // Determine client name
        const name = dto.companyName || `${dto.firstName || ''} ${dto.lastName || ''}`.trim();
        if (!name) {
            throw new Error('Either company name or first/last name is required');
        }

        // Create client entity
        const client = new Client({
            userId: dto.userId,
            name,
            contact: {
                firstName: dto.firstName,
                lastName: dto.lastName,
                email: email.value,
                phone: dto.phone,
                businessPhone: dto.businessPhone,
                mobilePhone: dto.mobilePhone,
                address: address?.toJSON(),
            },
            preferences: {
                sendReminders: dto.sendReminders ?? false,
                lateFees: dto.lateFees ?? false,
                currency: dto.currency || 'USD',
                language: dto.language || 'English (United States)',
                attachments: dto.attachments ?? false,
            },
            metadata: {
                source: 'api',
                tags: dto.tags || [],
                customFields: dto.customFields || {},
            },
        });

        // Save to repository
        const savedClient = await this.clientRepository.save(client);

        // Return DTO
        return this.toDTO(savedClient);
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
