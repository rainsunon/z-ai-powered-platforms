package com.ofo.reviewservice.dal;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import com.ofo.reviewservice.model.Review;

@Repository
public class ReviewDALImpl implements ReviewDAL {
	
	@Autowired
	private MongoTemplate mongoTemplate;
	
	@Override
	public Review getReviewbyId(String reviewId) {
		Query query = new Query();
		query.addCriteria(Criteria.where("reviewId").is(reviewId));
		return mongoTemplate.findOne(query, Review.class);
	}

	@Override
	public Review saveReview(Review review) {
		Review _review = mongoTemplate.save(review);
		return _review;
	}

	@Override
	public List<Review> getReviewbyUserId(String userId) {
		Query query = new Query();
		query.addCriteria(Criteria.where("userId").is(userId));;
		return mongoTemplate.find(query,Review.class);
	}

	@Override
	public List<Review> getReviewbyRestaurantId(String restaurantId) {
		Query query = new Query();
		query.addCriteria(Criteria.where("restaurantId").is(restaurantId));;
		return mongoTemplate.find(query,Review.class);
	}

}
