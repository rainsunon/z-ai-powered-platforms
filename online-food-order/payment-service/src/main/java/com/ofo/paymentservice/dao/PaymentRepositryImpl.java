package com.ofo.paymentservice.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import com.ofo.paymentservice.model.Payment;

@Repository
public class PaymentRepositryImpl implements PaymentRepositry {


	@Autowired
	private MongoTemplate mongoTemplate;
	
	@Override
	public Payment getPaymentbyId(String paymentId) {
		Query query = new Query();
		query.addCriteria(Criteria.where("paymentId").is(paymentId));
		return mongoTemplate.findOne(query, Payment.class);
	}

	@Override
	public Payment savePayment(Payment payment) {
		System.out.println("payment repo=="+payment);
		Payment _payment = mongoTemplate.save(payment);
		return _payment;
	}
	
	@Override
	public Payment updatePayment(Payment _payment) {
		Payment payment = mongoTemplate.save(_payment);
		return payment;
	}
	
}
