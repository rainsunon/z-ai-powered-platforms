package com.ofo.reviewservice.controller;

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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;

import com.ofo.reviewservice.model.ErrorModel;
import com.ofo.reviewservice.model.Review;
import com.ofo.reviewservice.service.ReviewService;
import com.ofo.reviewservice.service.RestaurantService;

/**
 * Contains the controller methods for all end-points related to Restaurant services
 *
 */
@RestController
@RequestMapping("/review")
public class ReviewController {

	private ReviewService reviewService;
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
	public ReviewController(ReviewService reviewService, RestaurantService restaurantService) {
		this.reviewService = reviewService;
		this.restaurantService = restaurantService;
	}

	/**
	 * This method fetches the user details based on the ID provided as input
	 * @param userId
	 * @return
	 */
	@GetMapping("/{reviewId}")
	public ResponseEntity<Review> getReviewbyId(@PathVariable String reviewId) {

		Review _review = reviewService.getReviewbyId(reviewId);
		if (_review == null)
			throw new NoSuchElementException();
		
		return new ResponseEntity<Review>(_review, HttpStatus.OK);
	}
	
	@GetMapping("/user/{userId}")
	public ResponseEntity<List<Review>> getReviewbyUserId(@PathVariable String userId) {
		List<Review> lReview = reviewService.getReviewbyUserId(userId);
		return new ResponseEntity<List<Review>>(lReview, HttpStatus.OK);
	}
	
	@GetMapping("/restaurant/{restaurantId}")
	public ResponseEntity<List<Review>> getReviewbyRestaurantId(@PathVariable String restaurantId) {
		List<Review> lReview = reviewService.getReviewbyRestaurantId(restaurantId);
		return new ResponseEntity<List<Review>>(lReview, HttpStatus.OK);
	}
	
	@PostMapping
	public ResponseEntity<Review> addNewReview(@RequestHeader("Authorization") String authToken, @RequestBody Review review) throws ParseException {

		
		Review _review = reviewService.saveReview(review);
		
		restaurantService.updateRating (authToken, review.getRestaurantId(), review.getUserRating());
		
		return new ResponseEntity<Review>(_review, HttpStatus.OK);
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
