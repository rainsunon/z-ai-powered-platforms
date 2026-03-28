package com.ofo.orderservice.dal;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.ofo.orderservice.model.Restaurant;

@Repository
public interface RestaurantDAL extends MongoRepository<Restaurant, String> {

}

