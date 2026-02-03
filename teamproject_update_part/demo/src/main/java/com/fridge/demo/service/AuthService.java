package com.fridge.demo.service;

import com.fridge.demo.dto.UserDto;
import com.fridge.demo.jwt.JwtTokenProvider;
import com.fridge.demo.model.User;
import com.fridge.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public UserDto.Response signUp(UserDto.SignUp request) {
        if (userRepository.existsByUserId(request.getUserId())) {
            throw new RuntimeException("이미 존재하는 아이디입니다.");
        }

        User user = User.builder()
                .userId(request.getUserId())
                .password(passwordEncoder.encode(request.getPassword()))
                .nickname(request.getNickname())
                .email(request.getEmail())
                .build();

        return UserDto.Response.fromEntity(userRepository.save(user));
    }

    public String login(UserDto.Login request) {
        User user = userRepository.findByUserId(request.getUserId())
                .orElseThrow(() -> new RuntimeException("아이디 또는 비밀번호가 틀렸습니다."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("아이디 또는 비밀번호가 틀렸습니다.");
        }

        return jwtTokenProvider.createToken(user.getUserId());
    }
}
