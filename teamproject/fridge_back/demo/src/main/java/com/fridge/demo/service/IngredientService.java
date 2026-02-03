package com.fridge.demo.service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fridge.demo.dto.request.CreateItemRequest;
import com.fridge.demo.dto.request.MoveToCartItemRequest;
import com.fridge.demo.dto.request.UpdateIngredientRequest;
import com.fridge.demo.model.CartItem;
import com.fridge.demo.model.Ingredient;
import com.fridge.demo.repository.CartItemRepository;
import com.fridge.demo.repository.IngredientRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class IngredientService {
    private final IngredientRepository ingredientRepository;
    private final CartItemRepository cartItemRepository;

    private static final Set<String> CHILLED_CATEGORIES = Set.of("meat", "vegetable", "other");
    private static final String FREEZER_CATEGORY = "freezer";

    private Ingredient findIngredientById(Long ingredientId) {
        return ingredientRepository.findById(ingredientId)
                .orElseThrow(() -> new RuntimeException("Ingredient not found"));
    }
    
    @Transactional
    public Ingredient createIngredient(CreateItemRequest request) {
        Ingredient ingredient = Ingredient.builder()
                .name(request.getName())
                .quantity(request.getQuantity())
                .unit(request.getUnit())
                .category(request.getCategory())
                .createdTime(LocalDateTime.now())
                .build();
        return ingredientRepository.save(ingredient);
    }

    @Transactional
    public void deleteIngredient(Long ingredientId) {
        Ingredient ingredient = findIngredientById(ingredientId);
//        if (!ingredient.getUser().getId().equals(user.getId())) {
//            throw new RuntimeException("Permission denied");
//        }
        ingredientRepository.delete(ingredient);
    }
    
    @Transactional
    public Optional<Ingredient> updateIngredient(Long id, UpdateIngredientRequest request) {
//        UserEntity user = findUserByEmail(userEmail);
        Optional<Ingredient> ingredientOpt = ingredientRepository.findById(id);

        if (ingredientOpt.isEmpty()) {
            return Optional.empty(); // 아이템이 없으면 빈 Optional 반환
        }
        
        Ingredient ingredient = ingredientOpt.get();
//        if (!ingredient.getUser().getId().equals(user.getId())) {
//            throw new RuntimeException("Permission denied");
//        }
        
        if (request.getName() != null) ingredient.setName(request.getName());
        if (request.getQuantity() != null) ingredient.setQuantity(request.getQuantity());
        if (request.getUnit() != null) ingredient.setUnit(request.getUnit());
        
        return Optional.of(ingredient);
    }

    @Transactional
    public Optional<Ingredient> updateCategory(Long ingredientId, String newCategory) {
//        UserEntity user = findUserByEmail(userEmail);
        Optional<Ingredient> ingredientOpt = ingredientRepository.findById(ingredientId);

        if (ingredientOpt.isEmpty()) {
            return Optional.empty(); // 아이템이 없으면 빈 Optional 반환
        }
        
        Ingredient ingredient = ingredientOpt.get();

//        if (!ingredient.getUser().getId().equals(user.getId())) {
//            throw new RuntimeException("Permission denied");
//        }
        String currentCategory = ingredient.getCategory();
        if (currentCategory.equals(newCategory)) return Optional.of(ingredient);

        boolean isMovingWithinChilled = CHILLED_CATEGORIES.contains(currentCategory) && CHILLED_CATEGORIES.contains(newCategory);
        if (isMovingWithinChilled) throw new IllegalArgumentException("냉장칸 내에서는 서로 이동할 수 없습니다.");

        boolean isMovingFromFreezerToChilled = currentCategory.equals(FREEZER_CATEGORY) && CHILLED_CATEGORIES.contains(newCategory);
        boolean isMovingFromChilledToFreezer = CHILLED_CATEGORIES.contains(currentCategory) && newCategory.equals(FREEZER_CATEGORY);

        if (isMovingFromFreezerToChilled || isMovingFromChilledToFreezer) {
            ingredient.setCategory(newCategory);
            return Optional.of(ingredient); // Optional로 감싸서 반환
        }
        throw new IllegalArgumentException("허용되지 않는 카테고리 이동입니다.");
    }

    @Transactional
    public Optional<CartItem> moveIngredientToCart(Long id, MoveToCartItemRequest request) {
//        UserEntity user = findUserByEmail(userEmail);
        Optional<Ingredient> ingredientOpt = ingredientRepository.findById(id);

        if (ingredientOpt.isEmpty()) {
            return Optional.empty(); // 아이템이 없으면 빈 Optional 반환
        }
        
        Ingredient ingredient = ingredientOpt.get();
        
//        if (!ingredient.getUser().getId().equals(user.getId())) {
//            throw new RuntimeException("Permission denied");
//        }
        
        int moveQuantity = request.getQuantity() != null ? request.getQuantity() : 1;
        if (moveQuantity > ingredient.getQuantity()) {
            throw new RuntimeException("재고 수량보다 많습니다.");
        }
        
        if (ingredient.getQuantity() > moveQuantity) {
            ingredient.setQuantity(ingredient.getQuantity() - moveQuantity);
            ingredientRepository.save(ingredient);
        } else {
            ingredientRepository.delete(ingredient);
        }

        Optional<CartItem> existingCartItemOpt = cartItemRepository
                .findByNameAndUserAndCategoryAndUnit(ingredient.getName(), ingredient.getCategory(), ingredient.getUnit());

        CartItem cartItem;
        if (existingCartItemOpt.isPresent()) {
            cartItem = existingCartItemOpt.get();
            cartItem.setQuantity(cartItem.getQuantity() + moveQuantity);
        } else {
            cartItem = CartItem.builder()
                    .name(ingredient.getName())
                    .quantity(moveQuantity)
                    .unit(ingredient.getUnit())
                    .category(ingredient.getCategory())
                    .sourceIngredientId(ingredient.getId())
//                    .user(user)
                    .createdAt(ingredient.getCreatedTime())
                    .build();
        }

        return Optional.of(cartItemRepository.save(cartItem)); // Optional로 감싸서 반환
    }
}