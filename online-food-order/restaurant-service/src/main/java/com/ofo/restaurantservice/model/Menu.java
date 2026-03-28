package com.ofo.restaurantservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Menu {
	
	private int itemId;
	private String itemName;
	private String description;
	private String price;
	private String itemStatus;
}
