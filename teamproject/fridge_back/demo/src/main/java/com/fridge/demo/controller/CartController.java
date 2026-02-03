package com.fridge.demo.controller;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fridge.demo.dto.CartItemDTO;
import com.fridge.demo.dto.IngredientDTO;
import com.fridge.demo.dto.request.CreateItemRequest;
import com.fridge.demo.dto.request.MoveToFridgeRequest;
import com.fridge.demo.model.CartItem;
import com.fridge.demo.model.Ingredient;
import com.fridge.demo.service.CartService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/cart")
public class CartController {
    
    private final CartService cartItemService;
    
    @PostMapping
    public ResponseEntity<CartItemDTO> createCartItem(@RequestBody CreateItemRequest request, Authentication authentication) {
        String userEmail = authentication.getName();
        CartItem newCartItem = cartItemService.createCartItem(request, userEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(CartItemDTO.fromEntity(newCartItem));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCartItem(@PathVariable("id") Long id, Authentication authentication) {
        String userEmail = authentication.getName();
        cartItemService.deleteCartItem(id, userEmail);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/{id}/move-to-fridge")
    public ResponseEntity<IngredientDTO> moveCartItemToFridge(
            @PathVariable("id") Long id, 
            @RequestBody MoveToFridgeRequest request,
            Authentication authentication) {
        String userEmail = authentication.getName();
        
        Optional<Ingredient> movedItemOpt = cartItemService.moveCartItemToFridge(id, request, userEmail);
        
        // 서비스에서 아이템을 찾지 못하면 404 Not Found 반환
        if (movedItemOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.status(HttpStatus.CREATED).body(IngredientDTO.fromEntity(movedItemOpt.get()));
    }

}