package com.xrsqx1.favouriteservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import java.util.TimeZone;

@SpringBootApplication(scanBasePackages = "com.xrs")
@EnableDiscoveryClient
public class FavouriteServiceApplication {

	public static void main(String[] args) {
		TimeZone.setDefault(TimeZone.getTimeZone("GMT +0:00"));
		SpringApplication.run(FavouriteServiceApplication.class, args);
	}

}
