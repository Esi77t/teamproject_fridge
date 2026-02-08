package com.fridge.demo.controller;

import com.fridge.demo.dto.IngredientDto;
import com.fridge.demo.service.IngredientService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ingredients")
@RequiredArgsConstructor
public class IngredientController {
    private final IngredientService ingredientService;

    @GetMapping
    public ResponseEntity<List<IngredientDto.Response>> getIngredients(@AuthenticationPrincipal String userId) {
        // JwtAuthenticationFilter에서 저장한 userId가 주입됩니다.
        return ResponseEntity.ok(ingredientService.getMyIngredients(userId));
    }

    /**
     * 유통기한 임박 재료 조회 (D-3 이하)
     */
    @GetMapping("/expiring-soon")
    public ResponseEntity<List<IngredientDto.Response>> getExpiringSoon(
            @AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(ingredientService.getExpiringSoon(userId));
    }

    /**
     * 만료된 재료 조회
     */
    @GetMapping("/expired")
    public ResponseEntity<List<IngredientDto.Response>> getExpired(
            @AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(ingredientService.getExpired(userId));
    }

    @PostMapping
    public ResponseEntity<IngredientDto.Response> addIngredient(
            @RequestBody IngredientDto.Request request,
            @AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(ingredientService.addIngredient(request, userId));
    }

    /**
     * 재료 삭제
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIngredient(
            @PathVariable Long id,
            @AuthenticationPrincipal String userId) {
        ingredientService.deleteIngredient(id, userId);
        return ResponseEntity.ok().build();
    }

    /**
     * 재료 카테고리 변경 (냉장고 내 이동)
     */
    @PatchMapping("/{id}/category")
    public ResponseEntity<IngredientDto.Response> updateCategory(
            @PathVariable Long id,
            @RequestBody CategoryUpdateRequest request,
            @AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(ingredientService.updateCategory(id, request.getCategory(), userId));
    }

    /**
     * 냉장고 재료 -> 장바구니 이동
     * @param id 이동할 재료 ID
     * @param moveQuantity 이동할 수량
     */
    @PostMapping("/{id}/move-to-cart")
    public ResponseEntity<Void> moveToCart(
            @PathVariable Long id,
            @RequestParam Integer moveQuantity,
            @AuthenticationPrincipal String userId) {

        ingredientService.moveToCart(id, moveQuantity, userId);
        return ResponseEntity.ok().build();
    }

    // 카테고리 업데이트 요청 DTO
    @Getter
    @Setter
    public static class CategoryUpdateRequest {
        private String category;
    }
}
