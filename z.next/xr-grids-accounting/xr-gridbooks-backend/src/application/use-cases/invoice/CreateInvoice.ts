import { IInvoiceRepository } from '../../../domain/repositories/IInvoiceRepository';
import { Invoice, LineItem } from '../../../domain/entities/Invoice';
import { CreateInvoiceDTO, InvoiceDTO } from '../../dtos/InvoiceDTO';

export class CreateInvoiceUseCase {
    constructor(private invoiceRepository: IInvoiceRepository) { }

    async execute(dto: CreateInvoiceDTO): Promise<InvoiceDTO> {
        // Calculate line item amounts
        const lineItems: LineItem[] = dto.lineItems.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            rate: item.rate,
            amount: item.amount || item.quantity * item.rate,
            metadata: item.metadata,
        }));

        // Create invoice entity
        const invoice = new Invoice({
            userId: dto.userId,
            clientId: dto.clientId,
            lineItems,
            metadata: dto.metadata || {},
            dueDate: dto.dueDate,
        });

        // Save to repository
        const savedInvoice = await this.invoiceRepository.save(invoice);

        // Return DTO
        return this.toDTO(savedInvoice);
    }

    private toDTO(invoice: Invoice): InvoiceDTO {
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
    }
}
