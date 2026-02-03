package com.fridge.demo.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fridge.demo.dto.CartItemDTO;
import com.fridge.demo.dto.IngredientDTO;
import com.fridge.demo.dto.WorkspaceDTO;
import com.fridge.demo.repository.CartItemRepository;
import com.fridge.demo.repository.IngredientRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class WorkspaceService {

    // 원래는 UserEntity가 있어야하나 내가 쓴 코드가 아니므로....

//    private final IngredientRepository ingredientRepository;
//    private final CartItemRepository cartItemRepository;
//
//    @Transactional(readOnly=true)
//    public WorkspaceDTO getWorkspaceForUser(String userEmail) {
//
//        List<IngredientDTO> ingredients = ingredientRepository.findAllByUser_Id(userPkId)
//                .stream()
//                .map(IngredientDTO::fromEntity)
//                .collect(Collectors.toList());
//
//        List<CartItemDTO> cartItems = cartItemRepository.findAllByUser_Id(userPkId)
//                .stream()
//                .map(CartItemDTO::fromEntity)
//                .collect(Collectors.toList());
//
//        log.info(">>>>> [WorkspaceService] 조회 결과: 냉장고 {}개, 장바구니 {}개", ingredients.size(), cartItems.size());
//
//        return WorkspaceDTO.builder()
//                .ingredients(ingredients)
//                .cartItems(cartItems)
//                .build();
//    }
}
