package com.distributedtransactions.queryservice.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Data
@Document(collection = "order_views")
public class OrderView {
    @Id
    private String orderId;
    private String customerId;
    private double amount;
    private String status;
}
