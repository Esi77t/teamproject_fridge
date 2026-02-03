package com.fridge.demo.controller;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fridge.demo.dto.CartItemDTO;
import com.fridge.demo.dto.IngredientDTO;
import com.fridge.demo.dto.request.CreateItemRequest;
import com.fridge.demo.dto.request.MoveToCartItemRequest;
import com.fridge.demo.dto.request.UpdateIngredientRequest;
import com.fridge.demo.model.CartItem;
import com.fridge.demo.model.Ingredient;
import com.fridge.demo.service.IngredientService;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
class UpdateCategoryRequest {
    private String category;
}

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/ingredients")
public class IngredientController {

    private final IngredientService ingredientService;

    @PostMapping
    public ResponseEntity<IngredientDTO> createIngredient(@RequestBody CreateItemRequest request) {
//        String userEmail = authentication.getName();
        Ingredient newIngredient = ingredientService.createIngredient(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(IngredientDTO.fromEntity(newIngredient));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIngredient(@PathVariable("id") Long id, Authentication authentication) {
//        String userEmail = authentication.getName();
        ingredientService.deleteIngredient(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}")
    public ResponseEntity<IngredientDTO> updateIngredient(@PathVariable("id") Long id, @RequestBody UpdateIngredientRequest request) {
//        String userEmail = authentication.getName();
        Optional<Ingredient> updatedIngredient = ingredientService.updateIngredient(id, request);
        
        return updatedIngredient.map(ingredient -> ResponseEntity.ok(IngredientDTO.fromEntity(ingredient)))
                                .orElse(ResponseEntity.notFound().build());
    }
    @PutMapping("/{id}/category")
    public ResponseEntity<IngredientDTO> updateCategory(@PathVariable("id") Long id, @RequestParam String newCategory) {
//        String userEmail = authentication.getName();
        Optional<Ingredient> updatedIngredient = ingredientService.updateCategory(id, newCategory);

        return updatedIngredient.map(ingredient -> ResponseEntity.ok(IngredientDTO.fromEntity(ingredient)))
                                .orElse(ResponseEntity.notFound().build());
    }


    @PostMapping("/{id}/move-to-cart")
    public ResponseEntity<CartItemDTO> moveIngredientToCart(@PathVariable("id") Long id, @RequestBody MoveToCartItemRequest request) {
//        String userEmail = authentication.getName();
        Optional<CartItem> cartItemOpt = ingredientService.moveIngredientToCart(id, request);
        
        return cartItemOpt.map(cartItem -> ResponseEntity.status(HttpStatus.CREATED).body(CartItemDTO.fromEntity(cartItem)))
                          .orElse(ResponseEntity.notFound().build());
    }
}