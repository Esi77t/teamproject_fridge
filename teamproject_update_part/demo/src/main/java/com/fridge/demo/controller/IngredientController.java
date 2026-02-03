package com.fridge.demo.controller;

import com.fridge.demo.dto.IngredientDto;
import com.fridge.demo.service.IngredientService;
import lombok.RequiredArgsConstructor;
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

    @PostMapping
    public ResponseEntity<IngredientDto.Response> addIngredient(
            @RequestBody IngredientDto.Request request,
            @AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(ingredientService.addIngredient(request, userId));
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
}
