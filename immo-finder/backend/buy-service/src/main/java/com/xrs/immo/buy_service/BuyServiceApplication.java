package com.xrs.immo.buy_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@ComponentScan(basePackages = "com.github.xrs.immo_finder")
@EntityScan(basePackages = "com.github.xrs.immo_finder.domain.model")
@EnableJpaRepositories(basePackages = "com.github.xrs.immo_finder.domain.repository")
public class BuyServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(BuyServiceApplication.class, args);
	}

}
