package com.fridge.demo.repository;

import com.fridge.demo.model.Ingredient;
import com.fridge.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IngredientRepository extends JpaRepository<Ingredient, Long> {
    // 특정 유저의 모든 냉장고 재료 조회
    List<Ingredient> findAllByUserOrderByCreatedAtDesc(User user);

    // 특정 유저의 특정 카테고리 재료 조회
    List<Ingredient> findAllByUserAndCategory(User user, String category);

    // 특정 유저의 특정 아이템이 이미 있는지 확인
    Optional<Ingredient> findByUserAndNameAndCategory(User user, String name, String category);
}