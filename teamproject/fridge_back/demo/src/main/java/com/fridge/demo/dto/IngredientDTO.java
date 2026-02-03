package com.fridge.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

import com.fridge.demo.model.Ingredient;

@Builder
@Getter
@AllArgsConstructor
public class IngredientDTO {

    private final Long id;
    private final String name;
    private final int quantity;
    private final String unit;
    private final String category;
    private final LocalDateTime createdTime;

    public static IngredientDTO fromEntity(Ingredient entity) {
        return IngredientDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .quantity(entity.getQuantity())
                .unit(entity.getUnit())
                .category(entity.getCategory())
                .createdTime(entity.getCreatedTime())
                .build();
    }
}
