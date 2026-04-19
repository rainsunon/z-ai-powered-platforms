import { Client } from '../entities/Client';

export interface IClientRepository {
    save(client: Client): Promise<Client>;
    findById(id: string): Promise<Client | null>;
    findByUserId(userId: string): Promise<Client[]>;
    findByEmail(email: string): Promise<Client | null>;
    update(client: Client): Promise<Client>;
    delete(id: string): Promise<void>;

    // Advanced JSONB queries
    findByPreference(key: string, value: any): Promise<Client[]>;
    findByMetadataContains(criteria: Record<string, any>): Promise<Client[]>;
    findWithCustomField(fieldName: string): Promise<Client[]>;
}
