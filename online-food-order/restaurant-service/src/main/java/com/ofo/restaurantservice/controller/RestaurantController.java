package com.ofo.restaurantservice.controller;

import java.lang.reflect.Field;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;

import com.ofo.restaurantservice.model.ErrorModel;
import com.ofo.restaurantservice.model.Menu;
import com.ofo.restaurantservice.model.Restaurant;
import com.ofo.restaurantservice.service.RestaurantService;

/**
 * Contains the controller methods for all end-points related to Restaurant services
 *
 */
@RestController
@RequestMapping("/restaurant")
public class RestaurantController {

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
	public RestaurantController(RestaurantService restaurantService) {
		this.restaurantService = restaurantService;
	}

	/**
	 * This method fetches the user details based on the ID provided as input
	 * @param userId
	 * @return
	 */
	@GetMapping("/{restaurantId}")
	public ResponseEntity<Restaurant> getRestaurantbyId(@PathVariable String restaurantId) {

		Restaurant _restaurant = restaurantService.getRestaurantById(restaurantId);
		if (_restaurant == null)
			throw new NoSuchElementException();
		
		return new ResponseEntity<Restaurant>(_restaurant, HttpStatus.OK);
	}
	
	@PutMapping
	public ResponseEntity<Restaurant> updateRestaurantbyId(@RequestBody @Valid Restaurant restaurant) throws MethodArgumentNotValidException {

		Restaurant _restaurant = restaurantService.getRestaurantById(restaurant.getId());
		
		if (_restaurant == null)
			throw new NoSuchElementException();
		
		int lastAssignedMenuItemId = _restaurant.getLastAssignedMenuItemId();		
		List<Menu> lMenu = restaurant.getMenuList();
		
		if(lMenu != null && lMenu.size() > 0)
			throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Incorrect request body");
			
		Field[] fields = Restaurant.class.getDeclaredFields();
        for (Field field : fields) {
            try {
                field.setAccessible(true);
                Object updatedValue = field.get(restaurant);
                if (updatedValue != null) {
                    field.set(_restaurant, updatedValue);
                }
            } catch (IllegalAccessException e) {
                e.printStackTrace(); 
            }
        }
        
		if(_restaurant.getLastAssignedMenuItemId() == 0) 
			_restaurant.setLastAssignedMenuItemId(lastAssignedMenuItemId);
			
		_restaurant = restaurantService.updateRestaurant(_restaurant);
		
		return new ResponseEntity<Restaurant>(_restaurant, HttpStatus.OK);
	}
	
	
	@PutMapping(value="/updatemenu")
	public ResponseEntity<Restaurant> updateMenubyRestaurantId(@RequestBody @Valid Restaurant restaurant) {

		Restaurant _restaurant = restaurantService.getRestaurantById(restaurant.getId());
		if (_restaurant == null)
			throw new NoSuchElementException();
		
		
		List<Menu> lMenu = restaurant.getMenuList();
		
		if(lMenu == null || lMenu.size() == 0)
			throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Incorrect request body");
		
		
		Field[] fields = Restaurant.class.getDeclaredFields();
        for (Field field : fields) {
            try {
                field.setAccessible(true);
                Object originalValue = field.get(_restaurant);
                Object updatedValue = field.get(restaurant);
                if (updatedValue != null) {
                	if (field.getName().equals("menuList")) {
                		mergeMenuList(_restaurant, (List<Menu>) originalValue, (List<Menu>) updatedValue);
                	}
                }
            } catch (IllegalAccessException e) {
                e.printStackTrace(); 
            }
        }
		
		_restaurant = restaurantService.updateRestaurant(_restaurant);
		
		return new ResponseEntity<Restaurant>(_restaurant, HttpStatus.OK);
	}
	
	private static void mergeMenuList(Restaurant _restaurant, List<Menu> originalMenuList, List<Menu> updatedMenuList) {
        for (Menu updatedMenu : updatedMenuList) {
            boolean found = false;
            for (Menu originalMenu : originalMenuList) {
                if (originalMenu.getItemId() == (updatedMenu.getItemId())) {
                	originalMenu.setItemName(updatedMenu.getItemName());
                	originalMenu.setDescription(updatedMenu.getDescription());
                	originalMenu.setItemStatus(updatedMenu.getItemStatus());
                	originalMenu.setPrice(updatedMenu.getPrice());
                    found = true;
                    break;
                }
            }
            if (!found) {
            	updatedMenu.setItemId(_restaurant.getLastAssignedMenuItemId()+1);
            	_restaurant.setLastAssignedMenuItemId(_restaurant.getLastAssignedMenuItemId()+1);
                originalMenuList.add(updatedMenu);
            }
        }
    }
	
	
	@PutMapping(value="/rating")
	public ResponseEntity<String> updateRatingbyRestuarantId(@RequestParam Map<String,String> allParams)
			throws MethodArgumentNotValidException {

		String restaurantId = "";
		String newUserRating = "";
				
		if (allParams != null && allParams.size() > 0) {
			for (Map.Entry<String,String> entry : allParams.entrySet()) {
				if(entry.getKey().equals("restaurantId"))
						restaurantId=entry.getValue();
				else if(entry.getKey().equals("rating"))
					newUserRating=entry.getValue();
			}
				
		}
				
		Restaurant _restaurant = restaurantService.getRestaurantById(restaurantId);
		
		if (_restaurant == null)
			throw new NoSuchElementException();
		
		double newRating = Double.parseDouble(newUserRating);
		
		if(_restaurant.getRating() == null) {
			_restaurant.setRating(newUserRating);
		} else {
			double oldRating = Double.parseDouble(_restaurant.getRating());
			double avgRating = (oldRating+newRating)/2;
			_restaurant.setRating(Double.toString(avgRating));
		}
					
		_restaurant = restaurantService.updateRestaurant(_restaurant);
		
		return new ResponseEntity<String>("Average Rating "+_restaurant.getRating(), HttpStatus.OK);
	}
	
	
	/**
	 * This method adds new user to the Mongo DB
	 * @param user
	 * @return
	 * @throws ParseException
	 */
	@PostMapping
	public ResponseEntity<Restaurant> addNewRestaurant(@RequestBody @Valid Restaurant restaurant) throws ParseException {
	//	String dob = user.getDob();
	//	user.setDob(convertDateFormat(dob));
		
		List<Menu> lMenu = restaurant.getMenuList();
		Menu menu;
		
		if (lMenu != null) {
			for(int i=0;i<lMenu.size();i++) {
				menu = lMenu.get(i);
				menu.setItemId(i+1);
			}
			restaurant.setLastAssignedMenuItemId(lMenu.size());
		}
		
		Restaurant _restaurant = restaurantService.saveRestaurant(restaurant);
		
		return new ResponseEntity<Restaurant>(_restaurant, HttpStatus.OK);
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
