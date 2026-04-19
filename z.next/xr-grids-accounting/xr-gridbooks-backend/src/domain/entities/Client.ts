import { Email } from '../value-objects/Email';
import { Money } from '../value-objects/Money';

export interface ClientContact {
    firstName?: string;
    lastName?: string;
    email: string;
    phone?: string;
    businessPhone?: string;
    mobilePhone?: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        zip?: string;
        country?: string;
    };
}

export interface ClientPreferences {
    sendReminders: boolean;
    lateFees: boolean;
    currency: string;
    language: string;
    attachments: boolean;
    customSettings?: Record<string, any>;
}

export interface ClientProps {
    id?: string;
    userId: string;
    name: string;
    contact: ClientContact;
    preferences: ClientPreferences;
    metadata?: Record<string, any>;
    totalOutstanding?: Money;
    credit?: Money;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Client {
    private readonly _id: string;
    private readonly _userId: string;
    private _name: string;
    private _contact: ClientContact;
    private _preferences: ClientPreferences;
    private _metadata: Record<string, any>;
    private _totalOutstanding: Money;
    private _credit: Money;
    private readonly _createdAt: Date;
    private _updatedAt: Date;

    constructor(props: ClientProps) {
        this._id = props.id || this.generateId();
        this._userId = props.userId;
        this._name = props.name;
        this._contact = props.contact;
        this._preferences = props.preferences;
        this._metadata = props.metadata || {};
        this._totalOutstanding = props.totalOutstanding || new Money(0, props.preferences.currency);
        this._credit = props.credit || new Money(0, props.preferences.currency);
        this._createdAt = props.createdAt || new Date();
        this._updatedAt = props.updatedAt || new Date();

        this.validate();
    }

    private validate(): void {
        if (!this._name || this._name.trim().length === 0) {
            throw new Error('Client name is required');
        }

        if (!this._userId) {
            throw new Error('User ID is required');
        }

        // Validate email
        new Email(this._contact.email);
    }

    private generateId(): string {
        return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Getters
    get id(): string {
        return this._id;
    }

    get userId(): string {
        return this._userId;
    }

    get name(): string {
        return this._name;
    }

    get contact(): ClientContact {
        return { ...this._contact };
    }

    get preferences(): ClientPreferences {
        return { ...this._preferences };
    }

    get metadata(): Record<string, any> {
        return { ...this._metadata };
    }

    get totalOutstanding(): Money {
        return this._totalOutstanding;
    }

    get credit(): Money {
        return this._credit;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    // Business methods
    updateContact(contact: Partial<ClientContact>): void {
        this._contact = { ...this._contact, ...contact };
        if (contact.email) {
            new Email(contact.email); // Validate
        }
        this._updatedAt = new Date();
    }

    updatePreferences(preferences: Partial<ClientPreferences>): void {
        this._preferences = { ...this._preferences, ...preferences };
        this._updatedAt = new Date();
    }

    addMetadata(key: string, value: any): void {
        this._metadata[key] = value;
        this._updatedAt = new Date();
    }

    addOutstanding(amount: Money): void {
        this._totalOutstanding = this._totalOutstanding.add(amount);
        this._updatedAt = new Date();
    }

    reduceOutstanding(amount: Money): void {
        this._totalOutstanding = this._totalOutstanding.subtract(amount);
        this._updatedAt = new Date();
    }

    addCredit(amount: Money): void {
        this._credit = this._credit.add(amount);
        this._updatedAt = new Date();
    }

    useCredit(amount: Money): void {
        if (this._credit.amount < amount.amount) {
            throw new Error('Insufficient credit');
        }
        this._credit = this._credit.subtract(amount);
        this._updatedAt = new Date();
    }

    getInitials(): string {
        if (this._contact.firstName && this._contact.lastName) {
            return `${this._contact.firstName[0]}${this._contact.lastName[0]}`.toUpperCase();
        }
        return this._name.substring(0, 2).toUpperCase();
    }
}
