package com.ofo.searchservice.model;

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
	private String prize;
	private String itemStatus;
}
