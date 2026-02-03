package com.fridge.demo.repository;

import com.fridge.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // 로그인하거나 사용자 식별을 위한 쿼리
    Optional<User> findByUserId(String userId);

    // 회원가입 시 중복 체크
    boolean existsByUserId(String userId);
    boolean existsByEmail(String email);
}
