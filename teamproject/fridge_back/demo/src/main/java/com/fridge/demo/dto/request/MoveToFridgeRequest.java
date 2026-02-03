package com.fridge.demo.dto.request;

import lombok.Getter;

@Getter
public class MoveToFridgeRequest {
	private Long id;
	private String category;
	private Integer quantity;
	private String unit;
}
