import { Money } from '../value-objects/Money';

export interface LineItem {
    description: string;
    quantity: number;
    rate: number;
    amount: number;
    metadata?: Record<string, any>;
}

export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Overdue';

export interface InvoiceProps {
    id?: string;
    invoiceNumber?: string;
    userId: string;
    clientId: string;
    lineItems: LineItem[];
    metadata?: Record<string, any>;
    status?: InvoiceStatus;
    amount?: Money;
    subtotal?: Money;
    tax?: Money;
    dueDate: Date;
    sentAt?: Date;
    paidAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Invoice {
    private readonly _id: string;
    private _invoiceNumber: string;
    private readonly _userId: string;
    private readonly _clientId: string;
    private _lineItems: LineItem[];
    private _metadata: Record<string, any>;
    private _status: InvoiceStatus;
    private _amount: Money;
    private _subtotal: Money;
    private _tax: Money;
    private _dueDate: Date;
    private _sentAt?: Date;
    private _paidAt?: Date;
    private readonly _createdAt: Date;
    private _updatedAt: Date;

    constructor(props: InvoiceProps) {
        this._id = props.id || this.generateId();
        this._invoiceNumber = props.invoiceNumber || this.generateInvoiceNumber();
        this._userId = props.userId;
        this._clientId = props.clientId;
        this._lineItems = props.lineItems;
        this._metadata = props.metadata || {};
        this._status = props.status || 'Draft';
        this._dueDate = props.dueDate;
        this._sentAt = props.sentAt;
        this._paidAt = props.paidAt;
        this._createdAt = props.createdAt || new Date();
        this._updatedAt = props.updatedAt || new Date();

        // Calculate amounts
        const calculated = this.calculateAmounts();
        this._subtotal = props.subtotal || calculated.subtotal;
        this._tax = props.tax || calculated.tax;
        this._amount = props.amount || calculated.total;

        this.validate();
    }

    private validate(): void {
        if (!this._userId) {
            throw new Error('User ID is required');
        }

        if (!this._clientId) {
            throw new Error('Client ID is required');
        }

        if (!this._lineItems || this._lineItems.length === 0) {
            throw new Error('At least one line item is required');
        }

        if (this._dueDate < new Date() && this._status === 'Draft') {
            throw new Error('Due date cannot be in the past for draft invoices');
        }
    }

    private generateId(): string {
        return `invoice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private generateInvoiceNumber(): string {
        const year = new Date().getFullYear();
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `INV-${year}-${random}`;
    }

    private calculateAmounts(): { subtotal: Money; tax: Money; total: Money } {
        const subtotalAmount = this._lineItems.reduce((sum, item) => sum + item.amount, 0);
        const taxAmount = 0; // TODO: Implement tax calculation based on business rules
        const totalAmount = subtotalAmount + taxAmount;

        return {
            subtotal: new Money(subtotalAmount, 'USD'),
            tax: new Money(taxAmount, 'USD'),
            total: new Money(totalAmount, 'USD'),
        };
    }

    // Getters
    get id(): string {
        return this._id;
    }

    get invoiceNumber(): string {
        return this._invoiceNumber;
    }

    get userId(): string {
        return this._userId;
    }

    get clientId(): string {
        return this._clientId;
    }

    get lineItems(): LineItem[] {
        return [...this._lineItems];
    }

    get metadata(): Record<string, any> {
        return { ...this._metadata };
    }

    get status(): InvoiceStatus {
        return this._status;
    }

    get amount(): Money {
        return this._amount;
    }

    get subtotal(): Money {
        return this._subtotal;
    }

    get tax(): Money {
        return this._tax;
    }

    get dueDate(): Date {
        return this._dueDate;
    }

    get sentAt(): Date | undefined {
        return this._sentAt;
    }

    get paidAt(): Date | undefined {
        return this._paidAt;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    // Business methods
    addLineItem(item: LineItem): void {
        this._lineItems.push(item);
        const calculated = this.calculateAmounts();
        this._subtotal = calculated.subtotal;
        this._tax = calculated.tax;
        this._amount = calculated.total;
        this._updatedAt = new Date();
    }

    removeLineItem(index: number): void {
        if (index < 0 || index >= this._lineItems.length) {
            throw new Error('Invalid line item index');
        }
        this._lineItems.splice(index, 1);
        const calculated = this.calculateAmounts();
        this._subtotal = calculated.subtotal;
        this._tax = calculated.tax;
        this._amount = calculated.total;
        this._updatedAt = new Date();
    }

    send(): void {
        if (this._status !== 'Draft') {
            throw new Error('Only draft invoices can be sent');
        }
        this._status = 'Sent';
        this._sentAt = new Date();
        this._updatedAt = new Date();
    }

    markAsPaid(): void {
        if (this._status === 'Paid') {
            throw new Error('Invoice is already paid');
        }
        this._status = 'Paid';
        this._paidAt = new Date();
        this._updatedAt = new Date();
    }

    markAsOverdue(): void {
        if (this._status === 'Paid') {
            throw new Error('Paid invoices cannot be overdue');
        }
        if (new Date() > this._dueDate) {
            this._status = 'Overdue';
            this._updatedAt = new Date();
        }
    }

    isOverdue(): boolean {
        return this._status !== 'Paid' && new Date() > this._dueDate;
    }
}
