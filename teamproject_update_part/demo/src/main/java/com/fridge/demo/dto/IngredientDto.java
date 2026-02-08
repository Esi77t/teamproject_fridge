package com.fridge.demo.dto;

import com.fridge.demo.model.Ingredient;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class IngredientDto {
    @Getter
    @Setter
    public static class Request {
        private String name;
        private int quantity;
        private String unit;
        private String category;
        private String icon;
        private LocalDate expirationDate;
    }

    @Getter
    @Builder
    public static class Response {
        private Long id;
        private String name;
        private int quantity;
        private String unit;
        private String category;
        private String icon;
        private LocalDateTime createdAt;
        private LocalDate expirationDate;
        private Long daysLeft; // 잔여 일수

        public static Response fromEntity(Ingredient ingredient) {
            Long daysLeft = ingredient.getDaysUntilExpiration();

            return Response.builder()
                    .id(ingredient.getId())
                    .name(ingredient.getName())
                    .quantity(ingredient.getQuantity())
                    .expirationDate(ingredient.getExpirationDate())
                    .daysLeft(daysLeft)
                    .unit(ingredient.getUnit())
                    .category(ingredient.getCategory())
                    .icon(ingredient.getIcon())
                    .createdAt(ingredient.getCreatedAt())
                    .build();
        }
    }
}
