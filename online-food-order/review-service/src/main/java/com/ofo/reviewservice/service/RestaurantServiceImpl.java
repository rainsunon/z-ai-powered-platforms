package com.ofo.reviewservice.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

/**
 *This service class reaches out to DAL layer to perform search operations on Restaurant object in Mongo DBc
 *
 */
@Service
public class RestaurantServiceImpl implements RestaurantService {
	
	@Autowired
	private RestTemplate restTemplate;

	@Value("${gateway.service.url}")
	private String restaurantServiceUrl;

	@Override
	public void updateRating(String authToken, String restaurantId, String userRating) {
		
		HttpHeaders headers = new HttpHeaders();
		headers.set("Authorization", authToken);
		
		HttpEntity<String> entity = new HttpEntity<String>(headers);
		
		 UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(restaurantServiceUrl+"/restaurant/rating")
	                .queryParam("restaurantId", restaurantId)
	                .queryParam("rating", userRating);

		restTemplate.exchange(
				 uriBuilder.toUriString(), 
				HttpMethod.PUT, entity, String.class).getBody();
	}


}
