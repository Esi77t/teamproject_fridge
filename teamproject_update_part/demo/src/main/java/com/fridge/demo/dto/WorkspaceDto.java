package com.fridge.demo.dto;

import lombok.*;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkspaceDto {
    private List<IngredientDto.Response> ingredients;
    private List<CartDto.Response> cartItems;
}
