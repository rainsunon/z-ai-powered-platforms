export interface CreateClientDTO {
    userId: string;
    firstName?: string;
    lastName?: string;
    companyName?: string;
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
    sendReminders?: boolean;
    lateFees?: boolean;
    currency?: string;
    language?: string;
    attachments?: boolean;
    tags?: string[];
    customFields?: Record<string, any>;
}

export interface UpdateClientDTO {
    name?: string;
    contact?: {
        firstName?: string;
        lastName?: string;
        email?: string;
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
    };
    preferences?: {
        sendReminders?: boolean;
        lateFees?: boolean;
        currency?: string;
        language?: string;
        attachments?: boolean;
    };
    metadata?: Record<string, any>;
}

export interface ClientDTO {
    id: string;
    userId: string;
    name: string;
    contact: {
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
    };
    preferences: {
        sendReminders: boolean;
        lateFees: boolean;
        currency: string;
        language: string;
        attachments: boolean;
        customSettings?: Record<string, any>;
    };
    metadata: Record<string, any>;
    totalOutstanding: number;
    credit: number;
    initials: string;
    createdAt: Date;
    updatedAt: Date;
}
