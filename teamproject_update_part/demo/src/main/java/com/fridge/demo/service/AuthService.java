package com.fridge.demo.service;

import com.fridge.demo.dto.TokenDto;
import com.fridge.demo.dto.UserDto;
import com.fridge.demo.jwt.JwtTokenProvider;
import com.fridge.demo.model.RefreshToken;
import com.fridge.demo.model.User;
import com.fridge.demo.repository.RefreshTokenRepository;
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
    private final RefreshTokenRepository refreshTokenRepository;

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

    public TokenDto login(UserDto.Login request) {
        User user = userRepository.findByUserId(request.getUserId())
                .orElseThrow(() -> new RuntimeException("아이디 또는 비밀번호가 틀렸습니다."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("아이디 또는 비밀번호가 틀렸습니다.");
        }

        String accessToken = jwtTokenProvider.createAccessToken(request.getUserId());
        String refreshTokenValue = jwtTokenProvider.createRefreshToken(request.getUserId());

        // DB 저장/갱신 로직
        refreshTokenRepository.findByUserId(user.getUserId())
                .ifPresentOrElse(
                        token -> token.updateToken(refreshTokenValue),
                        () -> refreshTokenRepository.save(
                                RefreshToken.builder()
                                        .userId(user.getUserId())
                                        .tokenValue(refreshTokenValue)
                                        .build()
                        )
                );

        return TokenDto.builder()
                .accessToken(accessToken)
                .refreshToken(refreshTokenValue)
                .build();
    }

    // 재f발급로직
    @Transactional
    public TokenDto reissue(String refreshTokenValue) {
        // 리프래시 토큰 유효성 검증
        if (!jwtTokenProvider.validateToken(refreshTokenValue)) {
            throw new RuntimeException("리프래시 토큰이 유효하지 않습니다.");
        }

        // 토큰에서 userId 추출
        String userId = jwtTokenProvider.getUserId(refreshTokenValue);

        // DB에서 해당 유저의 리프래시 토큰 조회
        RefreshToken refreshToken = refreshTokenRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("로그아웃 된 사용자 입니다."));

        // DB의 토큰과 클라이언트가 보낸 토큰이 일치하는지 확인
        if (!refreshToken.getTokenValue().equals(refreshTokenValue)) {
            throw new RuntimeException("토큰의 유저 정보가 일치하지 않습니다");
        }

        // 새 토큰 생성
        String newAccessToken = jwtTokenProvider.createAccessToken(userId);
        String newRefreshTokenValue = jwtTokenProvider.createRefreshToken(userId);

        // DB 토큰 업데이트
        refreshToken.updateToken(newRefreshTokenValue);

        return TokenDto.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshTokenValue)
                .build();
    }

    @Transactional
    public void logout(String userId) {
        refreshTokenRepository.findByUserId(userId)
                .ifPresent(refreshTokenRepository::delete);
    }

    // 유저 정보 조회(로그인 유지 확인용)
    public UserDto.Response getUserInfo(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        return UserDto.Response.fromEntity(user);
    }
}
