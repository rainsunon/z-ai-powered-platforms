package com.ofo.searchservice.dal;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import com.ofo.searchservice.model.Restaurant;

@Repository
@CacheConfig(cacheNames = {"Restaurant"})
public class SearchDALImpl implements SearchDAL {
	
	@Autowired
	private MongoTemplate mongoTemplate;
	
	@Override
	@Cacheable
	public Restaurant getRestaurantById(String restaurantId) {
		Query query = new Query();
		query.addCriteria(Criteria.where("id").is(restaurantId));
		return mongoTemplate.findOne(query, Restaurant.class);
	}

	@Override
	public List<Restaurant> searchRestaurant(Map<String, String> allParams) {
		Query query = new Query();
		
		for (Map.Entry<String,String> entry : allParams.entrySet()) {
			String sParameterName = entry.getKey();
			if (sParameterName.equals("itemName"))
				sParameterName = "menuList."+sParameterName;
			query.addCriteria(Criteria.where(sParameterName).is(entry.getValue()));
		}
		return mongoTemplate.find(query,Restaurant.class);
	}

}
