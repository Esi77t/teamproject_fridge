package com.fridge.demo.controller;

import com.fridge.demo.dto.UserDto;
import com.fridge.demo.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<UserDto.Response> signUp(@RequestBody UserDto.SignUp request) {
        return ResponseEntity.ok(authService.signUp(request));
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody UserDto.Login request) {
        String token = authService.login(request);
        // 클라이언트가 'Bearer '를 붙이기 편하게 헤더나 바디에 담아 보냅니다.
        return ResponseEntity.ok(token);
    }
}