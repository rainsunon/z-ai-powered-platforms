package com.ofo.orderservice.controller;

import java.text.ParseException;
import java.util.List;
import java.util.NoSuchElementException;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;

import com.ofo.orderservice.model.ErrorModel;
import com.ofo.orderservice.model.Item;
import com.ofo.orderservice.model.Order;
import com.ofo.orderservice.service.OrderService;
import com.ofo.orderservice.service.RestaurantService;

/**
 * Contains the controller methods for all end-points related to Restaurant services
 *
 */
@RestController
@RequestMapping("/order")
public class OrderController {

	private OrderService orderService;
	private RestaurantService restaurantService;

	@Value("${error.user.resourceNotAvailable}")
	private String eResourceNotAvailable;
	@Value("${error.user.invalidInput}")
	private String eInvalidInput;
	@Value("${errorCode.user.resourceNotAvailable}")
	private String eResourceNotFoundCode;
	@Value("${errorCode.user.invalidInput}")
	private String eInavlidInputCode;
	@Value("${error.user.fields}")
	private String errorField;

	@Autowired
	public OrderController(OrderService orderService, RestaurantService restaurantService) {
		this.orderService = orderService;
		this.restaurantService = restaurantService;
	}

	/**
	 * This method fetches the user details based on the ID provided as input
	 * @param userId
	 * @return
	 */
	@GetMapping("/{orderId}")
	public ResponseEntity<Order> getOrderbyId(@PathVariable String orderId) {

		Order _order = orderService.getOrderbyId(orderId);
		if (_order == null)
			throw new NoSuchElementException();
		
		return new ResponseEntity<Order>(_order, HttpStatus.OK);
	}
	
	@GetMapping("/user/{userId}")
	public ResponseEntity<List<Order>> getOrderbyUserId(@PathVariable String userId) {
		List<Order> lOrder = orderService.getOrderbyUserId(userId);
		return new ResponseEntity<List<Order>>(lOrder, HttpStatus.OK);
	}
	
	@GetMapping("/restaurant/{restaurantId}")
	public ResponseEntity<List<Order>> getOrderbyRestaurantId(@PathVariable String restaurantId) {
		List<Order> lOrder = orderService.getOrderbyRestaurantId(restaurantId);
		return new ResponseEntity<List<Order>>(lOrder, HttpStatus.OK);
	}
	
	@PutMapping
	public ResponseEntity<String> updateOrder(@RequestBody Order order) {
		
		Order _order = orderService.getOrderbyId(order.getOrderId());
		if (_order == null)
			throw new NoSuchElementException();
		
		_order.setStatus(order.getStatus());
		_order = orderService.updateOrder(_order);
		
		return new ResponseEntity<String>("Order Status updated to "+_order.getStatus(), HttpStatus.OK);
	}
	
	
	@PostMapping
	public ResponseEntity<Order> addNewOrder(@RequestBody Order order) throws ParseException {

		List<Item> lItem = order.getItemList();
		Double totalPrice = 0.0;
		Double itemPrice = 0.0;
		String restaurantId= order.getRestaurantId();
		
		if (lItem != null) {
			for(Item item:lItem) {
				itemPrice = restaurantService.getItemPrice(restaurantId,item.getItemId());
				item.setItemPrice(itemPrice);
				totalPrice = totalPrice+(item.getQuantity()*itemPrice);
			}
		}
		
		order.setTotalPrice(totalPrice);
		order.setStatus("Pending Payment");
		
		Order _order = orderService.saveOrder(order);
		
		return new ResponseEntity<Order>(_order, HttpStatus.OK);
	}
	

	/**
	 * This method handles exception when payment is made for the incorrect request body 
	 * 
	 * @param
	 * @return ErrorModel
	 */
	@ExceptionHandler(MethodArgumentNotValidException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	public ErrorModel handleInValidInputException() {
		ErrorModel errorModel = new ErrorModel();
		errorModel.setErrorMessage(eInvalidInput);
		errorModel.setErrorCode(eInavlidInputCode);
		return errorModel;
	}
	
	/**
	 * This method handles exception when payment is made for the incorrect request body 
	 * 
	 * @param
	 * @return ErrorModel
	 */
	@ExceptionHandler(HttpClientErrorException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	public ErrorModel handleInValidRequestBodException() {
		ErrorModel errorModel = new ErrorModel();
		errorModel.setErrorMessage(eInvalidInput +" Wrong parameters");
		errorModel.setErrorCode(eInavlidInputCode);
		return errorModel;
	}

	/**
	 * This method handles exception when payment is made for the unbooked rooms
	 * 
	 * @param
	 * @return ErrorModel
	 */
	@ExceptionHandler(NoSuchElementException.class)
	@ResponseStatus(HttpStatus.NOT_FOUND)
	public ErrorModel handleRequestedResourceNotFoundException() {
		ErrorModel errorModel = new ErrorModel();
		errorModel.setErrorMessage(eResourceNotAvailable);
		errorModel.setErrorCode(eResourceNotFoundCode);
		return errorModel;
	}

}
