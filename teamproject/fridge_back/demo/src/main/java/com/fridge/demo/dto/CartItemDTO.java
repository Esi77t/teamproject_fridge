package com.fridge.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

import com.fridge.demo.model.CartItem;

@Getter
@Builder
@AllArgsConstructor
public class CartItemDTO {

    private final Long id;
    private final String name;
    private final int quantity;
    private final String unit;
    private final String category;
    private final LocalDateTime createdAt;
    private final Long sourceIngredientId;

    public static CartItemDTO fromEntity(CartItem entity) {
        return CartItemDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .quantity(entity.getQuantity())
                .unit(entity.getUnit())
                .category(entity.getCategory())
                .createdAt(entity.getCreatedAt())
                .sourceIngredientId(entity.getSourceIngredientId())
                .build();
    }
}