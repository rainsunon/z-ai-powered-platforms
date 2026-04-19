import { Invoice, InvoiceStatus } from '../entities/Invoice';

export interface InvoiceFilter {
    userId?: string;
    clientId?: string;
    status?: InvoiceStatus;
    startDate?: Date;
    endDate?: Date;
}

export interface IInvoiceRepository {
    save(invoice: Invoice): Promise<Invoice>;
    findById(id: string): Promise<Invoice | null>;
    findByInvoiceNumber(invoiceNumber: string): Promise<Invoice | null>;
    findByUserId(userId: string, filter?: InvoiceFilter): Promise<Invoice[]>;
    findByClientId(clientId: string): Promise<Invoice[]>;
    update(invoice: Invoice): Promise<Invoice>;
    delete(id: string): Promise<void>;

    // Business queries
    findOverdueInvoices(userId: string): Promise<Invoice[]>;
    findByStatus(userId: string, status: InvoiceStatus): Promise<Invoice[]>;
    getTotalOutstanding(userId: string): Promise<number>;
}
