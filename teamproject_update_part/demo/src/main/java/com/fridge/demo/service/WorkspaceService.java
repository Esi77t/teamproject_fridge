package com.fridge.demo.service;

import com.fridge.demo.dto.WorkspaceDto;
import com.fridge.demo.repository.IngredientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WorkspaceService {
    private final IngredientService ingredientService;
    private final CartService cartService;

    public WorkspaceDto getWorkspace(String userId) {
        return WorkspaceDto.builder()
                .ingredients(ingredientService.getMyIngredients(userId))
                .cartItems(cartService.getMyCart(userId))
                .build();
    }
}
