package com.xrs.fooddelivery.order;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.ComponentScan;

//@EnableCaching // Required for Spring's Cache Abstraction
@EnableFeignClients(basePackages = "com.xrs.fooddelivery.order.client")
@SpringBootApplication
@ComponentScan(basePackages = "com.xrs.fooddelivery")
public class OrderServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(OrderServiceApplication.class, args);
	}

}
