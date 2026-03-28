package com.ofo.orderservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Item {
	
	private int itemId;
	private String itemName;
	private int quantity;
	private Double itemPrice;
}
