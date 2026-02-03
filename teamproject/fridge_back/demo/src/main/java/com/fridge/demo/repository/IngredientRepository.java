package com.fridge.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fridge.demo.model.Ingredient;

@Repository
public interface IngredientRepository extends JpaRepository<Ingredient, Long> {
	List<Ingredient> findAllByUserId(String userId);
	List<Ingredient> findAllByUser_Email(String email);
	List<Ingredient> findAllByUser_Id(String userId);
	Optional<Ingredient> findByNameAndUserAndCategoryAndUnit(String name, String category, String unit);
	void deleteByUserId(String id);
}