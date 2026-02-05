package com.fridge.demo.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class RefreshToken extends BaseTimeEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String userId; // 이메일이 아닌 로그인 아이디(userId) 사용

    @Column(nullable = false)
    private String tokenValue;

    public void updateToken(String newTokenValue) {
        this.tokenValue = newTokenValue;
    }
}
