package com.xrs.paymentservice.helper;

import com.xrs.paymentservice.dto.OrderDto;
import com.xrs.paymentservice.dto.PaymentDto;
import com.xrs.paymentservice.dto.UserDto;
import com.xrs.paymentservice.entity.Payment;

public interface PaymentMappingHelper {
    static PaymentDto map(final Payment payment) {
        return new PaymentDto(
                payment.getPaymentId(),
                payment.getIsPayed(),
                payment.getPaymentStatus(),
                payment.getOrderId(),
                payment.getUserId(),
                new OrderDto(
                        payment.getOrderId(),
                        null, // orderDate
                        null, // orderDesc
                        null, // orderFee
                        null, // productId
                        null  // productDto
                ),
                new UserDto(
                        payment.getUserId(),
                        null, // fullname
                        null, // username
                        null, // email
                        null, // gender
                        null, // phone
                        null  // avatar
                )
        );
    }

    static Payment map(final PaymentDto paymentDto) {
        return Payment.builder()
                .paymentId(paymentDto.paymentId())
                .orderId(paymentDto.orderId())
                .userId(paymentDto.userId())
                .isPayed(paymentDto.isPayed())
                .paymentStatus(paymentDto.paymentStatus())
                .build();
    }
}
