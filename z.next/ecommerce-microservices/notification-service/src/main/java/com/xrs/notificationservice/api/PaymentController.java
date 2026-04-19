package com.xrs.notificationservice.api;

import com.xrs.notificationservice.dto.PaymentDto;
import com.xrs.notificationservice.entity.Payment;
import com.xrs.notificationservice.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public Mono<Payment> savePayment(@RequestBody PaymentDto paymentDto) {
        return paymentService.savePayment(paymentDto);
    }

    @GetMapping("/{paymentId}")
    public Mono<Payment> getPayment(@PathVariable Integer paymentId) {
        return paymentService.getPayment(paymentId);
    }

    @GetMapping
    public Mono<List<Payment>> getAllPayments() {
        return paymentService.getAllPayments();
    }

    @DeleteMapping("/{paymentId}")
    public Mono<Void> deletePayment(@PathVariable Integer paymentId) {
        return paymentService.deletePayment(paymentId);
    }

}