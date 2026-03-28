package com.ofo.reviewservice.service;

import java.util.List;

import com.ofo.reviewservice.model.Review;

public interface ReviewService {

	Review getReviewbyId(String reviewId);

	List<Review> getReviewbyUserId(String userId);

	List<Review> getReviewbyRestaurantId(String restaurantId);

	Review saveReview(Review review);


}
