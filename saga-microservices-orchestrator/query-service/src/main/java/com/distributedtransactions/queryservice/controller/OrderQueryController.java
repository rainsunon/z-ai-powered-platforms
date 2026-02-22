package com.distributedtransactions.queryservice.controller;

import com.distributedtransactions.queryservice.model.OrderView;
import com.distributedtransactions.queryservice.repository.OrderViewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderQueryController {

    private final OrderViewRepository orderViewRepository;

    @GetMapping("/{orderId}")
    public Optional<OrderView> getOrderView(@PathVariable String orderId) {
        return orderViewRepository.findById(orderId);
    }

    @GetMapping
    public Iterable<OrderView> getAllOrderViews() {
        return orderViewRepository.findAll();
    }
}
