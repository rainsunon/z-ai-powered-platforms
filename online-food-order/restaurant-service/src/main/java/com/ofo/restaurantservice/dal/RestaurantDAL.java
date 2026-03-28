package com.ofo.restaurantservice.dal;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.ofo.restaurantservice.model.Restaurant;

/**
 * This interface extends the MongoRepository to perform the CRUD operations on PrescriptionRepository
 *
 */
@Repository
public interface RestaurantDAL extends MongoRepository<Restaurant, String> {

}
