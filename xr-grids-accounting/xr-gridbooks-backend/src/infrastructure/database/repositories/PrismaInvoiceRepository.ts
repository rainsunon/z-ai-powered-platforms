import { PrismaClient } from '@prisma/client';
import { IInvoiceRepository, InvoiceFilter } from '../../../domain/repositories/IInvoiceRepository';
import { Invoice, InvoiceStatus, LineItem } from '../../../domain/entities/Invoice';
import { Money } from '../../../domain/value-objects/Money';

export class PrismaInvoiceRepository implements IInvoiceRepository {
    constructor(private prisma: PrismaClient) { }

    async save(invoice: Invoice): Promise<Invoice> {
        const data = await this.prisma.invoice.create({
            data: {
                id: invoice.id,
                invoiceNumber: invoice.invoiceNumber,
                userId: invoice.userId,
                clientId: invoice.clientId,
                lineItems: invoice.lineItems as any,
                metadata: invoice.metadata as any,
                status: invoice.status,
                amount: invoice.amount.amount,
                subtotal: invoice.subtotal.amount,
                tax: invoice.tax.amount,
                dueDate: invoice.dueDate,
                sentAt: invoice.sentAt,
                paidAt: invoice.paidAt,
            },
        });

        return this.toDomain(data);
    }

    async findById(id: string): Promise<Invoice | null> {
        const data = await this.prisma.invoice.findUnique({
            where: { id },
        });

        return data ? this.toDomain(data) : null;
    }

    async findByInvoiceNumber(invoiceNumber: string): Promise<Invoice | null> {
        const data = await this.prisma.invoice.findUnique({
            where: { invoiceNumber },
        });

        return data ? this.toDomain(data) : null;
    }

    async findByUserId(userId: string, filter?: InvoiceFilter): Promise<Invoice[]> {
        const where: any = { userId };

        if (filter) {
            if (filter.clientId) where.clientId = filter.clientId;
            if (filter.status) where.status = filter.status;
            if (filter.startDate || filter.endDate) {
                where.createdAt = {};
                if (filter.startDate) where.createdAt.gte = filter.startDate;
                if (filter.endDate) where.createdAt.lte = filter.endDate;
            }
        }

        const data = await this.prisma.invoice.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });

        return data.map((item) => this.toDomain(item));
    }

    async findByClientId(clientId: string): Promise<Invoice[]> {
        const data = await this.prisma.invoice.findMany({
            where: { clientId },
            orderBy: { createdAt: 'desc' },
        });

        return data.map((item) => this.toDomain(item));
    }

    async update(invoice: Invoice): Promise<Invoice> {
        const data = await this.prisma.invoice.update({
            where: { id: invoice.id },
            data: {
                lineItems: invoice.lineItems as any,
                metadata: invoice.metadata as any,
                status: invoice.status,
                amount: invoice.amount.amount,
                subtotal: invoice.subtotal.amount,
                tax: invoice.tax.amount,
                dueDate: invoice.dueDate,
                sentAt: invoice.sentAt,
                paidAt: invoice.paidAt,
                updatedAt: invoice.updatedAt,
            },
        });

        return this.toDomain(data);
    }

    async delete(id: string): Promise<void> {
        await this.prisma.invoice.delete({
            where: { id },
        });
    }

    async findOverdueInvoices(userId: string): Promise<Invoice[]> {
        const now = new Date();
        const data = await this.prisma.invoice.findMany({
            where: {
                userId,
                status: { not: 'Paid' },
                dueDate: { lt: now },
            },
            orderBy: { dueDate: 'asc' },
        });

        return data.map((item) => this.toDomain(item));
    }

    async findByStatus(userId: string, status: InvoiceStatus): Promise<Invoice[]> {
        const data = await this.prisma.invoice.findMany({
            where: { userId, status },
            orderBy: { createdAt: 'desc' },
        });

        return data.map((item) => this.toDomain(item));
    }

    async getTotalOutstanding(userId: string): Promise<number> {
        const result = await this.prisma.invoice.aggregate({
            where: {
                userId,
                status: { in: ['Sent', 'Overdue'] },
            },
            _sum: {
                amount: true,
            },
        });

        return Number(result._sum.amount || 0);
    }

    // Helper method to convert Prisma model to domain entity
    private toDomain(data: any): Invoice {
        return new Invoice({
            id: data.id,
            invoiceNumber: data.invoiceNumber,
            userId: data.userId,
            clientId: data.clientId,
            lineItems: data.lineItems as LineItem[],
            metadata: data.metadata as Record<string, any>,
            status: data.status as InvoiceStatus,
            amount: new Money(Number(data.amount), 'USD'),
            subtotal: new Money(Number(data.subtotal), 'USD'),
            tax: new Money(Number(data.tax), 'USD'),
            dueDate: data.dueDate,
            sentAt: data.sentAt,
            paidAt: data.paidAt,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        });
    }
}
