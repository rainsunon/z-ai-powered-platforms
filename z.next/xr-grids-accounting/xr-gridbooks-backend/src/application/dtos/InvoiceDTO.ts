export interface LineItemDTO {
    description: string;
    quantity: number;
    rate: number;
    amount?: number;
    metadata?: Record<string, any>;
}

export interface CreateInvoiceDTO {
    userId: string;
    clientId: string;
    lineItems: LineItemDTO[];
    dueDate: Date;
    metadata?: Record<string, any>;
}

export interface InvoiceDTO {
    id: string;
    invoiceNumber: string;
    userId: string;
    clientId: string;
    lineItems: LineItemDTO[];
    metadata: Record<string, any>;
    status: string;
    amount: number;
    subtotal: number;
    tax: number;
    dueDate: Date;
    sentAt?: Date;
    paidAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
