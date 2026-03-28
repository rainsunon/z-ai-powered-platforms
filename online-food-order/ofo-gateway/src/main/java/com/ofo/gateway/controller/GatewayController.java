package com.ofo.gateway.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


/**
 * Contains the controller methods for all end-points related to Restaurant services
 *
 */
@RestController
@RequestMapping("/")
public class GatewayController {


	@GetMapping
	public ResponseEntity<String> getStatus() {
		
		String instanceId = "";
		try {
			instanceId = retrieveInstanceId();
		} catch (Exception e) {
			
		}
		if (instanceId == null || instanceId == "") {
			instanceId = "";
		} else {
			instanceId = instanceId+"-";
		}
		return new ResponseEntity<>(instanceId+"OK", 
				   HttpStatus.OK);
	
	}
	
	public String retrieveInstanceId() throws IOException {
	    String EC2Id = null;
	    String inputLine;
	    URL EC2MetaData = new URL("http://169.254.169.254/latest/meta-data/instance-id");
	    URLConnection EC2MD = EC2MetaData.openConnection();
	    BufferedReader in = new BufferedReader(new InputStreamReader(EC2MD.getInputStream()));
	    while ((inputLine = in.readLine()) != null) {
	        EC2Id = inputLine;
	    }
	    in.close();
	    return EC2Id;
	}
}
