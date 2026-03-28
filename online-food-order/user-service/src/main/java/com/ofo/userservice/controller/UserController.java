package com.ofo.userservice.controller;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.NoSuchElementException;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.ofo.userservice.model.ErrorModel;
import com.ofo.userservice.model.User;
import com.ofo.userservice.service.UserService;

/**
 * Contains the controller methods for all end-points related to User services
 *
 */
@RestController
@RequestMapping("/users")
public class UserController {

	private UserService userService;

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
	public UserController(UserService userService) {
		this.userService = userService;
	}

	/**
	 * This method fetches the user details based on the ID provided as input
	 * @param userId
	 * @return
	 */
	@GetMapping("/{userId}")
	public ResponseEntity<User> getUserbyId(@PathVariable String userId) {

		User _user = userService.getUserById(userId);
		if (_user == null)
			throw new NoSuchElementException();
		
		return new ResponseEntity<User>(_user, HttpStatus.OK);
	}

	/**
	 * This method adds new user to the MY-SQL DB
	 * @param user
	 * @return
	 * @throws ParseException
	 */
	@PostMapping
	public ResponseEntity<User> addNewUser(@RequestBody @Valid User user) throws ParseException {
	//	String dob = user.getDob();
	//	user.setDob(convertDateFormat(dob));
		
		User _user = userService.saveUser(user);
		return new ResponseEntity<User>(_user, HttpStatus.OK);
	}
	
	@PutMapping
	public ResponseEntity<User> updateUserbyId(@RequestBody @Valid User user) {

		User _user = userService.getUserById(Long.toString(user.getId()));
		if (_user == null)
			throw new NoSuchElementException();
		
		_user = userService.updateUser(user);
		
		return new ResponseEntity<User>(_user, HttpStatus.OK);
	}
	
	@DeleteMapping("/{userId}")
	public ResponseEntity<String> deleteUserbyId(@PathVariable String userId) {

		User _user = userService.getUserById(userId);
		if (_user == null)
			throw new NoSuchElementException();
		
		userService.deleteUser(_user);
		
		return new ResponseEntity<String>("User Deleted", HttpStatus.OK);
	}


	/**
	 * This method handles exception when bad request is made
	 * 
	 * @param
	 * @return ErrorModel
	 */
	@ExceptionHandler(MethodArgumentNotValidException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	public ErrorModel handleInValidInputException() {
		ErrorModel errorModel = new ErrorModel();
		String[] errorFields = errorField.split(", ");
		errorModel.setErrorMessage(eInvalidInput);
		errorModel.setErrorCode(eInavlidInputCode);
		errorModel.setErrorFields(errorFields);
		return errorModel;
	}

	/**
	 * This method handles exception when user is found
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
		errorModel.setErrorFields(null);
		return errorModel;
	}

	public static String convertToString(Date date) {
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
		return dateFormat.format(date);
	}

	public static String convertDateFormat(String strDate) throws ParseException {
		SimpleDateFormat inputFormat = new SimpleDateFormat("dd-MM-yyyy");
		SimpleDateFormat outputFormat = new SimpleDateFormat("yyyy-MM-dd");
		Date date = inputFormat.parse(strDate);
		return outputFormat.format(date);
	}

}
