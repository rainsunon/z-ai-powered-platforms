package com.ofo.searchservice.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ofo.searchservice.dal.SearchDAL;
import com.ofo.searchservice.model.Restaurant;

/**
 *This service class reaches out to DAL layer to perform search operations on Restaurant object in Mongo DBc
 *
 */
@Service
public class SearchServiceImpl implements SearchService {

	private SearchDAL searchDAL;

	@Autowired
	public SearchServiceImpl(SearchDAL searchDAL) {
		this.searchDAL = searchDAL;
	}

	@Override
	public Restaurant getRestaurantById(String restaurantId) {
		Restaurant oRestaurant = searchDAL.getRestaurantById(restaurantId);
		return oRestaurant;
	}

	@Override
	public List<Restaurant> searchRestaurants(Map<String, String> allParams) {
		return searchDAL.searchRestaurant(allParams);
	}

}
