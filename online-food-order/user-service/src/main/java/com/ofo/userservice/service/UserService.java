package com.ofo.userservice.service;

import com.ofo.userservice.model.User;

public interface UserService {

	User getUserById(String userId);

	User saveUser(User user);

	void deleteUser(User user);

	User updateUser(User user);

}
