import { PrismaClient } from '@prisma/client';
import { IClientRepository } from '../../../domain/repositories/IClientRepository';
import { Client, ClientContact, ClientPreferences } from '../../../domain/entities/Client';
import { Money } from '../../../domain/value-objects/Money';

export class PrismaClientRepository implements IClientRepository {
    constructor(private prisma: PrismaClient) { }

    async save(client: Client): Promise<Client> {
        const data = await this.prisma.client.create({
            data: {
                id: client.id,
                userId: client.userId,
                name: client.name,
                contact: client.contact as any,
                preferences: client.preferences as any,
                metadata: client.metadata as any,
                totalOutstanding: client.totalOutstanding.amount,
                credit: client.credit.amount,
            },
        });

        return this.toDomain(data);
    }

    async findById(id: string): Promise<Client | null> {
        const data = await this.prisma.client.findUnique({
            where: { id },
        });

        return data ? this.toDomain(data) : null;
    }

    async findByUserId(userId: string): Promise<Client[]> {
        const data = await this.prisma.client.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });

        return data.map((item) => this.toDomain(item));
    }

    async findByEmail(email: string): Promise<Client | null> {
        // Using JSONB query to search within contact field
        const data = await this.prisma.$queryRaw<any[]>`
      SELECT * FROM clients
      WHERE contact->>'email' = ${email}
      LIMIT 1
    `;

        return data.length > 0 ? this.toDomain(data[0]) : null;
    }

    async update(client: Client): Promise<Client> {
        const data = await this.prisma.client.update({
            where: { id: client.id },
            data: {
                name: client.name,
                contact: client.contact as any,
                preferences: client.preferences as any,
                metadata: client.metadata as any,
                totalOutstanding: client.totalOutstanding.amount,
                credit: client.credit.amount,
                updatedAt: client.updatedAt,
            },
        });

        return this.toDomain(data);
    }

    async delete(id: string): Promise<void> {
        await this.prisma.client.delete({
            where: { id },
        });
    }

    // Advanced JSONB queries
    async findByPreference(key: string, value: any): Promise<Client[]> {
        // Using PostgreSQL JSONB containment operator @>
        const data = await this.prisma.$queryRaw<any[]>`
      SELECT * FROM clients
      WHERE preferences @> ${JSON.stringify({ [key]: value })}::jsonb
    `;

        return data.map((item) => this.toDomain(item));
    }

    async findByMetadataContains(criteria: Record<string, any>): Promise<Client[]> {
        // Using JSONB containment for flexible metadata queries
        const data = await this.prisma.$queryRaw<any[]>`
      SELECT * FROM clients
      WHERE metadata @> ${JSON.stringify(criteria)}::jsonb
    `;

        return data.map((item) => this.toDomain(item));
    }

    async findWithCustomField(fieldName: string): Promise<Client[]> {
        // Using JSONB key existence operator ?
        const data = await this.prisma.$queryRaw<any[]>`
      SELECT * FROM clients
      WHERE metadata ? ${fieldName}
    `;

        return data.map((item) => this.toDomain(item));
    }

    // Helper method to convert Prisma model to domain entity
    private toDomain(data: any): Client {
        return new Client({
            id: data.id,
            userId: data.userId,
            name: data.name,
            contact: data.contact as ClientContact,
            preferences: data.preferences as ClientPreferences,
            metadata: data.metadata as Record<string, any>,
            totalOutstanding: new Money(
                Number(data.totalOutstanding),
                (data.preferences as ClientPreferences).currency
            ),
            credit: new Money(Number(data.credit), (data.preferences as ClientPreferences).currency),
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        });
    }
}
