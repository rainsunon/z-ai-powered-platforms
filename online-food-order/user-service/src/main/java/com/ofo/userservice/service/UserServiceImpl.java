package com.ofo.userservice.service;

import java.io.IOException;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ofo.userservice.dal.UserDAL;
import com.ofo.userservice.model.User;

/**
 *This service class reaches out to DAL layer to perform CRUD operations on User's object in Mongo DB
 *Reaches to AWS S3 bucket to upload the files and retrieve the file names
 *Sends the asynchronous notification to Kafka topic
 *
 */
@Service
public class UserServiceImpl implements UserService {

	private UserDAL userDAL;

	@Autowired
	public UserServiceImpl(UserDAL userDAL) {
		this.userDAL = userDAL;
	}

	@Override
	public User getUserById(String userId) {
		return userDAL.findById(Long.parseLong(userId)).get();
	}

	@Override
	public User saveUser(User user) {
		User _user = userDAL.save(user);
		return _user;
	}

	@Override
	public User updateUser(User user) {
		User _user = userDAL.save(user);
		return _user;
	}

	@Override
	public void deleteUser(User user) {
		userDAL.delete(user);
		
	}

}
