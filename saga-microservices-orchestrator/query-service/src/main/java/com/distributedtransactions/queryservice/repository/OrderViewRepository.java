package com.distributedtransactions.queryservice.repository;

import com.distributedtransactions.queryservice.model.OrderView;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface OrderViewRepository extends MongoRepository<OrderView, String> {
}
