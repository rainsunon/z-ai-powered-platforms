package com.ofo.restaurantservice.model;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "Restaurant")
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class Restaurant {
	
	@Id
	private String id;
	private String name;
	private String buildingNumber;
	private String streetName;
	private String city;
	private String state;
	private String country;
    private String zipCode;
    private String status;
    private int lastAssignedMenuItemId;
    private List<Menu> menuList;
    private String Rating;
}
