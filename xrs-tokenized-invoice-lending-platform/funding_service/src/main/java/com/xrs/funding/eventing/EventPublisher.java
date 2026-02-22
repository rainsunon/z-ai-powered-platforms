package com.xrs.funding.eventing;

import com.xrs.funding.dto.InvoiceFundedEvent;

public interface EventPublisher {
    void publishInvoiceFunded(InvoiceFundedEvent event);
}
