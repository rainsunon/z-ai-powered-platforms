package com.ofo.paymentservice.service;

import com.ofo.paymentservice.model.Payment;

public interface PaymentService {

	Payment savePayment(Payment payment);

	String updateOrderStatus(String orderId, String authToken, String orderStatus);

	Payment getPaymentbyId(String paymentId);
	
	Payment updatePayment(Payment _payment);
}
