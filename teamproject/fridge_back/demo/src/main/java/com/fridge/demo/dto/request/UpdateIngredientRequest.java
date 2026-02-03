package com.fridge.demo.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UpdateIngredientRequest {
	private Long id;
	private String name;
    private Integer quantity;
    private String unit;
    private String icon;
}
