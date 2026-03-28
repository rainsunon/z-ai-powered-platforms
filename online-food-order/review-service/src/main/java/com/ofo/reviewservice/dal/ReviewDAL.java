package com.ofo.reviewservice.dal;
import java.util.List;

import com.ofo.reviewservice.model.Review;

/**
 * This interface extends the MongoRepository to perform the CRUD operations on PrescriptionRepository
 *
 */
public interface ReviewDAL {

	Review getReviewbyId(String reviewId);

	Review saveReview(Review review);

	List<Review> getReviewbyUserId(String userId);

	List<Review> getReviewbyRestaurantId(String restaurantId);

}
