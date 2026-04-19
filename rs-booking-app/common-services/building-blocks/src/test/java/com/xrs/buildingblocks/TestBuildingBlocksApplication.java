package com.xrs.buildingblocks;

import org.springframework.boot.SpringApplication;

public class TestBuildingBlocksApplication {

	public static void main(String[] args) {
		SpringApplication.from(BuildingBlocksApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
