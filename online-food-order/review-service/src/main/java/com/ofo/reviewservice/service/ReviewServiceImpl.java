package com.ofo.reviewservice.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ofo.reviewservice.dal.ReviewDAL;
import com.ofo.reviewservice.model.Review;

/**
 *This service class reaches out to DAL layer to perform search operations on Restaurant object in Mongo DBc
 *
 */
@Service
public class ReviewServiceImpl implements ReviewService {

	@Autowired
	private ReviewDAL reviewDAL;

	@Override
	public Review getReviewbyId(String reviewId) {
		return reviewDAL.getReviewbyId(reviewId);
	}

	@Override
	public Review saveReview(Review review) {
		return reviewDAL.saveReview(review);
	}

	@Override
	public List<Review> getReviewbyUserId(String userId) {
		return reviewDAL.getReviewbyUserId(userId);
	}

	@Override
	public List<Review> getReviewbyRestaurantId(String restaurantId) {
		return reviewDAL.getReviewbyRestaurantId(restaurantId);
	}

}
