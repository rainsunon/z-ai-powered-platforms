package com.ofo.paymentservice.dao;

import com.ofo.paymentservice.model.Payment;

public interface PaymentRepositry {

	public Payment savePayment(Payment payment);

	Payment getPaymentbyId(String paymentId);

	Payment updatePayment(Payment _payment);

}
