import { CreateInvoiceUseCase } from '../../../application/use-cases/invoice/CreateInvoice';
import { PrismaInvoiceRepository } from '../../../infrastructure/database/repositories/PrismaInvoiceRepository';
import { PrismaClientRepository } from '../../../infrastructure/database/repositories/PrismaClientRepository';
import { prisma } from '../../../infrastructure/database/prisma/client';
import { InvoiceStatus } from '../../../domain/entities/Invoice';

const invoiceRepository = new PrismaInvoiceRepository(prisma);
const clientRepository = new PrismaClientRepository(prisma);

export const invoiceResolvers = {
    Query: {
        invoice: async (_: any, { id }: { id: string }, context: any) => {
            if (!context.user) {
                throw new Error('Unauthorized');
            }

            const invoice = await invoiceRepository.findById(id);
            if (!invoice) {
                throw new Error('Invoice not found');
            }

            if (invoice.userId !== context.user.userId) {
                throw new Error('Forbidden');
            }

            return {
                id: invoice.id,
                invoiceNumber: invoice.invoiceNumber,
                userId: invoice.userId,
                clientId: invoice.clientId,
                lineItems: invoice.lineItems,
                metadata: invoice.metadata,
                status: invoice.status,
                amount: invoice.amount.amount,
                subtotal: invoice.subtotal.amount,
                tax: invoice.tax.amount,
                dueDate: invoice.dueDate,
                sentAt: invoice.sentAt,
                paidAt: invoice.paidAt,
                createdAt: invoice.createdAt,
                updatedAt: invoice.updatedAt,
            };
        },

        invoices: async (_: any, { status }: { status?: InvoiceStatus }, context: any) => {
            if (!context.user) {
                throw new Error('Unauthorized');
            }

            const invoices = status
                ? await invoiceRepository.findByStatus(context.user.userId, status)
                : await invoiceRepository.findByUserId(context.user.userId);

            return invoices.map((invoice) => ({
                id: invoice.id,
                invoiceNumber: invoice.invoiceNumber,
                userId: invoice.userId,
                clientId: invoice.clientId,
                lineItems: invoice.lineItems,
                metadata: invoice.metadata,
                status: invoice.status,
                amount: invoice.amount.amount,
                subtotal: invoice.subtotal.amount,
                tax: invoice.tax.amount,
                dueDate: invoice.dueDate,
                sentAt: invoice.sentAt,
                paidAt: invoice.paidAt,
                createdAt: invoice.createdAt,
                updatedAt: invoice.updatedAt,
            }));
        },

        overdueInvoices: async (_: any, __: any, context: any) => {
            if (!context.user) {
                throw new Error('Unauthorized');
            }

            const invoices = await invoiceRepository.findOverdueInvoices(context.user.userId);

            return invoices.map((invoice) => ({
                id: invoice.id,
                invoiceNumber: invoice.invoiceNumber,
                userId: invoice.userId,
                clientId: invoice.clientId,
                lineItems: invoice.lineItems,
                metadata: invoice.metadata,
                status: invoice.status,
                amount: invoice.amount.amount,
                subtotal: invoice.subtotal.amount,
                tax: invoice.tax.amount,
                dueDate: invoice.dueDate,
                sentAt: invoice.sentAt,
                paidAt: invoice.paidAt,
                createdAt: invoice.createdAt,
                updatedAt: invoice.updatedAt,
            }));
        },

        totalOutstanding: async (_: any, __: any, context: any) => {
            if (!context.user) {
                throw new Error('Unauthorized');
            }

            return await invoiceRepository.getTotalOutstanding(context.user.userId);
        },
    },

    Invoice: {
        client: async (parent: any, _: any, context: any) => {
            const client = await clientRepository.findById(parent.clientId);
            if (!client) return null;

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
    },

    Mutation: {
        createInvoice: async (_: any, { input }: { input: any }, context: any) => {
            if (!context.user) {
                throw new Error('Unauthorized');
            }

            const useCase = new CreateInvoiceUseCase(invoiceRepository);
            return await useCase.execute({
                ...input,
                userId: context.user.userId,
            });
        },

        sendInvoice: async (_: any, { id }: { id: string }, context: any) => {
            if (!context.user) {
                throw new Error('Unauthorized');
            }

            const invoice = await invoiceRepository.findById(id);
            if (!invoice) {
                throw new Error('Invoice not found');
            }

            if (invoice.userId !== context.user.userId) {
                throw new Error('Forbidden');
            }

            invoice.send();
            const updated = await invoiceRepository.update(invoice);

            return {
                id: updated.id,
                invoiceNumber: updated.invoiceNumber,
                userId: updated.userId,
                clientId: updated.clientId,
                lineItems: updated.lineItems,
                metadata: updated.metadata,
                status: updated.status,
                amount: updated.amount.amount,
                subtotal: updated.subtotal.amount,
                tax: updated.tax.amount,
                dueDate: updated.dueDate,
                sentAt: updated.sentAt,
                paidAt: updated.paidAt,
                createdAt: updated.createdAt,
                updatedAt: updated.updatedAt,
            };
        },

        markInvoiceAsPaid: async (_: any, { id }: { id: string }, context: any) => {
            if (!context.user) {
                throw new Error('Unauthorized');
            }

            const invoice = await invoiceRepository.findById(id);
            if (!invoice) {
                throw new Error('Invoice not found');
            }

            if (invoice.userId !== context.user.userId) {
                throw new Error('Forbidden');
            }

            invoice.markAsPaid();
            const updated = await invoiceRepository.update(invoice);

            return {
                id: updated.id,
                invoiceNumber: updated.invoiceNumber,
                userId: updated.userId,
                clientId: updated.clientId,
                lineItems: updated.lineItems,
                metadata: updated.metadata,
                status: updated.status,
                amount: updated.amount.amount,
                subtotal: updated.subtotal.amount,
                tax: updated.tax.amount,
                dueDate: updated.dueDate,
                sentAt: updated.sentAt,
                paidAt: updated.paidAt,
                createdAt: updated.createdAt,
                updatedAt: updated.updatedAt,
            };
        },

        deleteInvoice: async (_: any, { id }: { id: string }, context: any) => {
            if (!context.user) {
                throw new Error('Unauthorized');
            }

            const invoice = await invoiceRepository.findById(id);
            if (!invoice) {
                throw new Error('Invoice not found');
            }

            if (invoice.userId !== context.user.userId) {
                throw new Error('Forbidden');
            }

            await invoiceRepository.delete(id);
            return true;
        },
    },
};
