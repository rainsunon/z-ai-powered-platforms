package com.ofo.paymentservice.controller;

import java.text.ParseException;
import java.util.Date;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ofo.paymentservice.model.Payment;
import com.ofo.paymentservice.service.PaymentService;

/**
 * Contains the controller methods for all end-points related to Payments
 *
 */
@RestController
@RequestMapping("/payment")
public class PaymentController {

	private PaymentService paymentService;

	@Autowired
	public PaymentController(PaymentService paymentService) {
		this.paymentService = paymentService;
	}

	/**
	 * This method saves the appointment object to Mongo DB
	 * @param authToken
	 * @param appointmentId
	 * @return
	 * @throws ParseException
	 */
	@PostMapping
	public ResponseEntity<Payment> processPayment(@RequestHeader("Authorization") String authToken,@RequestBody Payment payment) throws ParseException {
		Date date = new Date();
		payment.setCreatedDate(date);
				
		Payment _payment  = paymentService.savePayment(payment);
		paymentService.updateOrderStatus(payment.getOrderId(), authToken,"Paid");
		return new ResponseEntity<Payment>(_payment, HttpStatus.OK);
	}
	
	@PutMapping
	public ResponseEntity<Payment> refundPayment(@RequestHeader("Authorization") String authToken,@RequestBody Payment payment) throws ParseException {
				
		Payment _payment = paymentService.getPaymentbyId(payment.getPaymentId());
		if (_payment == null)
			throw new NoSuchElementException();
		
		Date date = new Date();
		_payment.setRefundedDate(date);
		_payment.setPaymentStatus(payment.getPaymentStatus());
		
		_payment  = paymentService.updatePayment(_payment);
		
		paymentService.updateOrderStatus(_payment.getOrderId(), authToken,"Cancelled");
		return new ResponseEntity<Payment>(_payment, HttpStatus.OK);
	}
	
	@GetMapping("/{paymentId}")
	public ResponseEntity<Payment> getPaymentbyId(@PathVariable String paymentId) {

		Payment _payment = paymentService.getPaymentbyId(paymentId);
		if (_payment == null)
			throw new NoSuchElementException();
		
		return new ResponseEntity<Payment>(_payment, HttpStatus.OK);
	}

}
