package com.fridge.demo.service;

import com.fridge.demo.dto.IngredientDto;
import com.fridge.demo.model.CartItem;
import com.fridge.demo.model.Ingredient;
import com.fridge.demo.model.User;
import com.fridge.demo.repository.CartItemRepository;
import com.fridge.demo.repository.IngredientRepository;
import com.fridge.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class IngredientService {
    private final IngredientRepository ingredientRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<IngredientDto.Response> getMyIngredients(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        return ingredientRepository.findAllByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(IngredientDto.Response::fromEntity)
                .collect(Collectors.toList());
    }

    public IngredientDto.Response addIngredient(IngredientDto.Request request, String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        Ingredient ingredient = Ingredient.builder()
                .name(request.getName())
                .quantity(request.getQuantity())
                .unit(request.getUnit())
                .category(request.getCategory())
                .icon(request.getIcon())
                .expirationDate(request.getExpirationDate())
                .user(user)
                .build();

        return IngredientDto.Response.fromEntity(ingredientRepository.save(ingredient));
    }

    @Transactional
    public void moveToCart(Long ingredientId, int moveQuantity, String userId) {
        // 소스(냉장고) 데이터 확인
        Ingredient ingredient = ingredientRepository.findById(ingredientId)
                .orElseThrow(() -> new RuntimeException("재료를 찾을 수 없습니다."));

        // 본인 확인 (보안)
        if (!ingredient.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("권한이 없습니다.");
        }

        // 수량 차감 또는 삭제
        if (ingredient.getQuantity() > moveQuantity) {
            ingredient.updateQuantity(ingredient.getQuantity() - moveQuantity);
        } else {
            ingredientRepository.delete(ingredient);
        }

        // 목적지(장바구니)에 추가
        // 같은 이름/카테고리의 품목이 이미 장바구니에 있는지 확인
        CartItem cartItem = cartItemRepository.findByUserAndNameAndCategory(ingredient.getUser(), ingredient.getName(), ingredient.getCategory())
                .orElse(CartItem.builder()
                        .name(ingredient.getName())
                        .quantity(0)
                        .unit(ingredient.getUnit())
                        .category(ingredient.getCategory())
                        .user(ingredient.getUser())
                        .build());

        cartItem.addQuantity(moveQuantity); // 기존 수량에 더함
        cartItemRepository.save(cartItem);
    }
}
