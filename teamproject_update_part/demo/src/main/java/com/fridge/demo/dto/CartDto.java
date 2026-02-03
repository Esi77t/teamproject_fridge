package com.fridge.demo.dto;

import com.fridge.demo.model.CartItem;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class CartDto {
    @Getter
    @Setter
    public static class Request {
        private String name;
        private int quantity;
        private String unit;
        private String category;
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
        private LocalDateTime createdAt;
        private LocalDate expirationDate;

        public static Response fromEntity(CartItem cartItem) {
            return Response.builder()
                    .id(cartItem.getId())
                    .name(cartItem.getName())
                    .quantity(cartItem.getQuantity())
                    .unit(cartItem.getUnit())
                    .category(cartItem.getCategory())
                    .createdAt(cartItem.getCreatedAt())
                    .expirationDate(cartItem.getExpirationDate())
                    .build();
        }
    }
}
