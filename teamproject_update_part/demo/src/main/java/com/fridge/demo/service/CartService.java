package com.fridge.demo.service;

import com.fridge.demo.dto.CartDto;
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
public class CartService {
    private final CartItemRepository cartItemRepository;
    private final IngredientRepository ingredientRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<CartDto.Response> getMyCart(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        return cartItemRepository.findAllByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(CartDto.Response::fromEntity)
                .collect(Collectors.toList());
    }

    public CartDto.Response addCartItem(CartDto.Request request, String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        CartItem cartItem = CartItem.builder()
                .name(request.getName())
                .quantity(request.getQuantity())
                .unit(request.getUnit())
                .category(request.getCategory())
                .user(user)
                .build();

        return CartDto.Response.fromEntity(cartItemRepository.save(cartItem));
    }

    @Transactional
    public void moveToFridge(Long cartItemId, String targetCategory, String userId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("항목을 찾을 수 없습니다."));

        // 본인 확인
        if (!cartItem.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("권한이 없습니다.");
        }

        // 냉장고에 추가 (장바구니의 정보를 그대로 이식)
        Ingredient ingredient = Ingredient.builder()
                .name(cartItem.getName())
                .quantity(cartItem.getQuantity())
                .unit(cartItem.getUnit())
                .category(targetCategory) // 카테고리는 이동 시 지정
                .expirationDate(cartItem.getExpirationDate()) // 장바구니의 날짜를 그대로 가져옴
                .user(cartItem.getUser())
                .build();

        ingredientRepository.save(ingredient);

        // 장바구니에서 삭제
        cartItemRepository.delete(cartItem);
    }
}