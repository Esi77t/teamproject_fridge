package com.fridge.demo.controller;

import com.fridge.demo.dto.TokenDto;
import com.fridge.demo.dto.UserDto;
import com.fridge.demo.service.AuthService;
import com.fridge.demo.util.CookieUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final CookieUtil cookieUtil;

    @PostMapping("/signup")
    public ResponseEntity<UserDto.Response> signUp(@RequestBody UserDto.SignUp request) {
        return ResponseEntity.ok(authService.signUp(request));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDto.Login request, HttpServletResponse response) {
        TokenDto tokens = authService.login(request);

        cookieUtil.setTokenCookie(response, tokens.getAccessToken(), tokens.getRefreshToken());

        return ResponseEntity.ok("로그인 성공");
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(HttpServletRequest request, HttpServletResponse response) {
        // 쿠키에서 refreshToken 추출
        String refreshToken = cookieUtil.getCookie(request, "refreshToken")
                .map(cookie -> cookie.getValue())
                .orElseThrow(() -> new RuntimeException("리프레시 토큰이 없습니다."));

        // 토큰 재발급 로직 실행
        TokenDto tokenDto = authService.reissue(refreshToken);

        // 새로운 토큰들을 다시 쿠키에 구워줌
        cookieUtil.setTokenCookie(response, tokenDto.getAccessToken(), tokenDto.getRefreshToken());

        return ResponseEntity.ok("토큰 재발급 성공");
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@AuthenticationPrincipal String userId, HttpServletResponse response) {
        // DB에서 토큰 삭제
        authService.logout(userId);

        // 브라우저 쿠키 삭제
        cookieUtil.deleteTokenCookies(response);

        return ResponseEntity.ok("로그아웃 성공");
    }
}