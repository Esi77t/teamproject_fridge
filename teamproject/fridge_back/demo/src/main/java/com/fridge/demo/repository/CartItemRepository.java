package com.fridge.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fridge.demo.model.CartItem;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
	List<CartItem> findAllByUserId(String userId);
	List<CartItem> findAllByUser_Email(String email);
	List<CartItem> findAllByUser_Id(String userId);
	Optional<CartItem> findByNameAndUserAndCategoryAndUnit(String name, String category, String unit);
	void deleteByUserId(String id);
}