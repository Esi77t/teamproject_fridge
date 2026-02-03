package com.fridge.demo.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
public class Ingredient extends BaseTimeEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private Integer quantity;
    private String unit;
    private String category; // vegetable, meat, freezer, other
    private String icon;
    // 유통기한
    private LocalDate expirationDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Builder
    public Ingredient(String name, int quantity, String unit, String category, String icon, User user) {
        this.name = name;
        this.quantity = quantity;
        this.unit = unit;
        this.category = category;
        this.icon = icon;
        this.user = user;
    }

    // 비즈니스 로직: 카테고리 변경이나 수량 수정 등을 엔티티 내부에서 처리 (객체지향적)
    public void updateInfo(String name, int quantity, String unit, String icon) {
        this.name = name;
        this.quantity = quantity;
        this.unit = unit;
        this.icon = icon;
    }

    public void changeCategory(String category) {
        this.category = category;
    }

    public void addQuantity(Integer amount) {
        this.quantity += amount;
    }

    public void updateQuantity(Integer newQuantity) {
        if (newQuantity < 0) {
            throw new IllegalArgumentException("수량은 0보다 작을 수 없습니다.");
        }
        this.quantity = newQuantity;
    }

    public long getDaysUntilExpiration() {
        if (this.expirationDate == null) return 999;
        return ChronoUnit.DAYS.between(LocalDate.now(), this.expirationDate);
    }
}
