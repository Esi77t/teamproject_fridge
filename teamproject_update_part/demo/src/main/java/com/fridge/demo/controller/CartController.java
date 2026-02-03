package com.fridge.demo.controller;

import com.fridge.demo.dto.CartDto;
import com.fridge.demo.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;

    @GetMapping
    public ResponseEntity<List<CartDto.Response>> getCart(@AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(cartService.getMyCart(userId));
    }

    @PostMapping
    public ResponseEntity<CartDto.Response> addToCart(
            @RequestBody CartDto.Request request,
            @AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(cartService.addCartItem(request, userId));
    }

    @PostMapping("/{id}/move")
    public ResponseEntity<Void> moveToFridge(
            @PathVariable Long id,
            @RequestParam String category,
            @AuthenticationPrincipal String userId) {
        cartService.moveToFridge(id, category, userId);
        return ResponseEntity.ok().build();
    }
}
