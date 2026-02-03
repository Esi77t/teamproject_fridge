package com.fridge.demo.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Setter
@Builder
public class CartItem extends BaseTimeEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private Integer quantity;
    private String unit;
    private String category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    // 유통기한
    private LocalDate expirationDate;

    @Builder
    public CartItem(String name, int quantity, String unit, String category, User user) {
        this.name = name;
        this.quantity = quantity;
        this.unit = unit;
        this.category = category;
        this.user = user;
    }

    public void addQuantity(Integer amount) {
        if (this.quantity == null) {
            this.quantity = 0;
        }
        this.quantity += amount;
    }
}
