package com.ofo.paymentservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.ofo.paymentservice.model.Order;
import com.ofo.paymentservice.dao.PaymentRepositry;
import com.ofo.paymentservice.model.Payment;

/**
 * This services reaches out to DAO layer to perform the CRUD operation on Payment object
 * and reaches out to appointment services to update the Payment status in Appointment Object
 *
 */
@Service
public class PaymentServiceImpl implements PaymentService {

	@Autowired
	private PaymentRepositry paymentRepositry;
	@Autowired
	private RestTemplate restTemplate;

	@Value("${gateway.service.url}")
	private String orderServiceUrl;

	/**
	 *Reaches out to appointment services to update the Payment status in Appointment Object
	 */
	@Override
	public String updateOrderStatus(String orderId,String authToken,String orderStatus) {

		HttpHeaders headers = new HttpHeaders();
		headers.set("Authorization", authToken);
		
		Order _order = new Order();
		_order.setOrderId(orderId);
		_order.setStatus(orderStatus);
		
		HttpEntity<Order> entity = new HttpEntity<Order>(_order,headers);

		return restTemplate.exchange(
				orderServiceUrl+"/order", HttpMethod.PUT, entity, String.class).getBody();
	}

	@Override
	public Payment savePayment(Payment payment) {
		return paymentRepositry.savePayment(payment) ;
	}

	@Override
	public Payment getPaymentbyId(String paymentId) {
		return paymentRepositry.getPaymentbyId(paymentId) ;
	}

	@Override
	public Payment updatePayment(Payment _payment) {
		return paymentRepositry.updatePayment(_payment) ;
	}

}
