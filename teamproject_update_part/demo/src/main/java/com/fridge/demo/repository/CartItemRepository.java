package com.fridge.demo.repository;

import com.fridge.demo.model.CartItem;
import com.fridge.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    // 특정 유저의 장바구니 목록 조회
    List<CartItem> findAllByUserOrderByCreatedAtDesc(User user);

    // 장바구니 비우기 기능 등을 위해 유저별 삭제 쿼리
    void deleteByUser(User user);

    // 유저, 이름, 카테고리가 모두 일치하는 장바구니 품목 찾기
    Optional<CartItem> findByUserAndNameAndCategory(User user, String name, String category);
}
