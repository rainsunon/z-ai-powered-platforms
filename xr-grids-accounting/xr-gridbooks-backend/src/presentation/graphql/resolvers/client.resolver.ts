import { CreateClientUseCase } from '../../../application/use-cases/client/CreateClient';
import { ListClientsUseCase } from '../../../application/use-cases/client/ListClients';
import { PrismaClientRepository } from '../../../infrastructure/database/repositories/PrismaClientRepository';
import { prisma } from '../../../infrastructure/database/prisma/client';

const clientRepository = new PrismaClientRepository(prisma);

export const clientResolvers = {
    Query: {
        client: async (_: any, { id }: { id: string }, context: any) => {
            if (!context.user) {
                throw new Error('Unauthorized');
            }

            const client = await clientRepository.findById(id);
            if (!client) {
                throw new Error('Client not found');
            }

            // Ensure user owns this client
            if (client.userId !== context.user.userId) {
                throw new Error('Forbidden');
            }

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
        },

        clients: async (_: any, __: any, context: any) => {
            if (!context.user) {
                throw new Error('Unauthorized');
            }

            const useCase = new ListClientsUseCase(clientRepository);
            return await useCase.execute(context.user.userId);
        },

        clientsByPreference: async (
            _: any,
            { key, value }: { key: string; value: any },
            context: any
        ) => {
            if (!context.user) {
                throw new Error('Unauthorized');
            }

            const clients = await clientRepository.findByPreference(key, value);

            // Filter by user
            return clients
                .filter((client) => client.userId === context.user.userId)
                .map((client) => ({
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
                }));
        },
    },

    Mutation: {
        createClient: async (_: any, { input }: { input: any }, context: any) => {
            if (!context.user) {
                throw new Error('Unauthorized');
            }

            const useCase = new CreateClientUseCase(clientRepository);
            return await useCase.execute({
                ...input,
                userId: context.user.userId,
            });
        },

        updateClient: async (_: any, { id, input }: { id: string; input: any }, context: any) => {
            if (!context.user) {
                throw new Error('Unauthorized');
            }

            const client = await clientRepository.findById(id);
            if (!client) {
                throw new Error('Client not found');
            }

            if (client.userId !== context.user.userId) {
                throw new Error('Forbidden');
            }

            // Update client
            if (input.contact) {
                client.updateContact(input.contact);
            }
            if (input.preferences) {
                client.updatePreferences(input.preferences);
            }
            if (input.metadata) {
                Object.entries(input.metadata).forEach(([key, value]) => {
                    client.addMetadata(key, value);
                });
            }

            const updated = await clientRepository.update(client);

            return {
                id: updated.id,
                userId: updated.userId,
                name: updated.name,
                contact: updated.contact,
                preferences: updated.preferences,
                metadata: updated.metadata,
                totalOutstanding: updated.totalOutstanding.amount,
                credit: updated.credit.amount,
                initials: updated.getInitials(),
                createdAt: updated.createdAt,
                updatedAt: updated.updatedAt,
            };
        },

        deleteClient: async (_: any, { id }: { id: string }, context: any) => {
            if (!context.user) {
                throw new Error('Unauthorized');
            }

            const client = await clientRepository.findById(id);
            if (!client) {
                throw new Error('Client not found');
            }

            if (client.userId !== context.user.userId) {
                throw new Error('Forbidden');
            }

            await clientRepository.delete(id);
            return true;
        },
    },
};
