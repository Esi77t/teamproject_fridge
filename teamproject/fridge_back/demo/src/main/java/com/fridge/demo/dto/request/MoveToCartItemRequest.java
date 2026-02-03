package com.fridge.demo.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class MoveToCartItemRequest {
	private Long id;
	private Integer quantity;
	private String unit;
}
