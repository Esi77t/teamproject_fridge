package com.fridge.demo.service;

import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fridge.demo.dto.request.CreateItemRequest;
import com.fridge.demo.dto.request.MoveToFridgeRequest;
import com.fridge.demo.model.CartItem;
import com.fridge.demo.model.Ingredient;
//import com.example.recipe.model.UserEntity;
import com.fridge.demo.repository.CartItemRepository;
import com.fridge.demo.repository.IngredientRepository;
//import com.fridge.demo.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class CartService {
    private final CartItemRepository cartItemRepository;
    private final IngredientRepository ingredientRepository;
//    private final UserRepository userRepository;

    // findUserByEmail은 그대로 유지
//    private UserEntity findUserByEmail(String userEmail) {
//        return userRepository.findByEmail(userEmail)
//                .orElseThrow(() -> new RuntimeException("User not found with email: " + userEmail));
//    }

    // ✅ findCartItemById() 헬퍼 메서드를 삭제했습니다.

    @Transactional
    public CartItem createCartItem(CreateItemRequest request, String userEmail) {
//        UserEntity user = findUserByEmail(userEmail);
        CartItem cartItem = CartItem.builder()
                .name(request.getName())
                .quantity(request.getQuantity())
                .unit(request.getUnit())
                .category(request.getCategory())
//                .user(user)
                .build();
        return cartItemRepository.save(cartItem);
    }

    @Transactional
    public Optional<Ingredient> moveCartItemToFridge(Long id, MoveToFridgeRequest request, String userEmail) {
//        UserEntity user = findUserByEmail(userEmail);
        Optional<CartItem> cartItemOpt = cartItemRepository.findById(id);
        
        // 아이템이 존재하지 않으면 빈 Optional 반환
        if (cartItemOpt.isEmpty()) {
            return Optional.empty();
        }
        
        CartItem cartItem = cartItemOpt.get();
        
//        if (!cartItem.getUser().getId().equals(user.getId())) {
//            throw new RuntimeException("Permission denied");
//        }
        
        int moveQuantity = request.getQuantity() != null ? request.getQuantity() : 1;
        if (moveQuantity > cartItem.getQuantity()) {
            throw new RuntimeException("장바구니 보다 수량이 많습니다.");
        }
        
        // 장바구니 수량 갱신 또는 삭제
        if (cartItem.getQuantity() > moveQuantity) {
            cartItem.setQuantity(cartItem.getQuantity() - moveQuantity);
            cartItemRepository.save(cartItem);
        } else {
            cartItemRepository.delete(cartItem);
        }
        
        Optional<Ingredient> existingIngredientOpt = ingredientRepository
                .findByNameAndUserAndCategoryAndUnit(cartItem.getName(), request.getCategory(), cartItem.getUnit());
        
        Ingredient ingredient;
        
        if(existingIngredientOpt.isPresent()) {
            ingredient = existingIngredientOpt.get();
            ingredient.setQuantity(ingredient.getQuantity() + moveQuantity);
        } else {
            ingredient = Ingredient.builder()
                    .name(cartItem.getName())
                    .quantity(moveQuantity)
                    .unit(cartItem.getUnit())
                    .category(request.getCategory())
                    .createdTime(cartItem.getCreatedAt())
//                    .user(user)
                    .build();
        }
        
        return Optional.of(ingredientRepository.save(ingredient));
    }

    @Transactional
    public boolean deleteCartItem(Long cartItemId, String userEmail) {
//    	UserEntity user = findUserByEmail(userEmail);
        Optional<CartItem> cartItemOpt = cartItemRepository.findById(cartItemId);
        
        // 아이템이 존재하지 않으면 false 반환
        if (cartItemOpt.isEmpty()) {
            return false;
        }

        CartItem cartItem = cartItemOpt.get();
        
//        if (!cartItem.getUser().getId().equals(user.getId())) {
//            throw new RuntimeException("Permission denied");
//        }
        
        cartItemRepository.delete(cartItem);
        return true;
    }
}