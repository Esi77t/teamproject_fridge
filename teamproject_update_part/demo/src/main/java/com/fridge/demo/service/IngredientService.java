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

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class IngredientService {
    private final IngredientRepository ingredientRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;

    // 냉장고 재료 가져오기
    @Transactional(readOnly = true)
    public List<IngredientDto.Response> getMyIngredients(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        return ingredientRepository.findAllByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(IngredientDto.Response::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * 유통기한 순으로 정렬된 재료 목록 조회
     */
    @Transactional(readOnly = true)
    public List<IngredientDto.Response> getMyIngredientsSortedByExpiration(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        return ingredientRepository.findAllByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(IngredientDto.Response::fromEntity)
                .sorted(Comparator.comparing(
                        dto -> dto.getDaysLeft() != null ? dto.getDaysLeft() : Long.MAX_VALUE
                ))
                .collect(Collectors.toList());
    }

    /**
     * 유통기한 임박 재료 조회 (D-3 이하)
     */
    @Transactional(readOnly = true)
    public List<IngredientDto.Response> getExpiringSoon(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        LocalDate threeDaysLater = LocalDate.now().plusDays(3);

        return ingredientRepository.findAllByUserOrderByCreatedAtDesc(user)
                .stream()
                .filter(ingredient -> ingredient.getExpirationDate() != null)
                .filter(ingredient -> !ingredient.getExpirationDate().isAfter(threeDaysLater))
                .filter(ingredient -> !ingredient.getExpirationDate().isBefore(LocalDate.now()))
                .map(IngredientDto.Response::fromEntity)
                .sorted(Comparator.comparing(dto -> dto.getDaysLeft() != null ? dto.getDaysLeft() : Long.MAX_VALUE))
                .collect(Collectors.toList());
    }

    /**
     * 만료된 재료 조회
     */
    @Transactional(readOnly = true)
    public List<IngredientDto.Response> getExpired(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        return ingredientRepository.findAllByUserOrderByCreatedAtDesc(user)
                .stream()
                .filter(ingredient -> ingredient.getExpirationDate() != null)
                .filter(ingredient -> ingredient.getExpirationDate().isBefore(LocalDate.now()))
                .map(IngredientDto.Response::fromEntity)
                .collect(Collectors.toList());
    }

    // 냉장고 재료 추가
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
    public void deleteIngredient(Long ingredientId, String userId) {
        Ingredient ingredient = ingredientRepository.findById(ingredientId)
                .orElseThrow(() -> new RuntimeException("재료를 찾을 수 없습니다."));

        if (!ingredient.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("권한이 없습니다.");
        }

        ingredientRepository.delete(ingredient);
    }

    /**
     * 재료 카테고리 변경 (냉장고 내 이동)
     */
    @Transactional
    public IngredientDto.Response updateCategory(Long ingredientId, String newCategory, String userId) {
        Ingredient ingredient = ingredientRepository.findById(ingredientId)
                .orElseThrow(() -> new RuntimeException("재료를 찾을 수 없습니다."));

        if (!ingredient.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("권한이 없습니다.");
        }

        // 카테고리 변경
        ingredient.changeCategory(newCategory);

        // 카테고리에 맞는 아이콘으로 변경
        String newIcon = getCategoryIcon(newCategory);
        ingredient.setIcon(newIcon);

        return IngredientDto.Response.fromEntity(ingredient);
    }

    /**
     * 카테고리별 기본 아이콘 반환
     */
    private String getCategoryIcon(String category) {
        return switch (category) {
            case "vegetable" -> "🥬";
            case "meat" -> "🥩";
            case "freezer" -> "❄️";
            case "other" -> "🍱";
            default -> "📦";
        };
    }

    // 냉장고 -> 장바구니 이동
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

        // 유통기한이 있으면 업데이트 (더 빠른 유통기한 우선)
        if (ingredient.getExpirationDate() != null) {
            if (cartItem.getExpirationDate() == null ||
                    ingredient.getExpirationDate().isBefore(cartItem.getExpirationDate())) {
                cartItem.setExpirationDate(ingredient.getExpirationDate());
            }
        }

        cartItemRepository.save(cartItem);
    }
}
