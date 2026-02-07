package com.fridge.demo.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import io.jsonwebtoken.io.Decoders;
import java.nio.charset.StandardCharsets;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Slf4j
@Component
public class JwtTokenProvider {

    private final Key key;
//    private final long tokenValidityInMilliseconds;

    // 만료 시간 설정
    private final long ACCESS_TOKEN_EXPIRE_TIME = 1000L * 60 * 30; // 30분
    private final long REFRESH_TOKEN_EXPIRE_TIME = 1000L * 60 * 60 * 24 * 7; // 7일

    public JwtTokenProvider(@Value("${jwt.secret}") String secretKey) {
//        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        this.key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
//        this.tokenValidityInMilliseconds = tokenValidityInSeconds * 1000;
    }

    // AccessToken 생성
    public String createAccessToken(String userId) {
        return createToken(userId, ACCESS_TOKEN_EXPIRE_TIME);
    }

    // RefreshToken 생성
    public String createRefreshToken(String userId) {
        return createToken(userId, REFRESH_TOKEN_EXPIRE_TIME);
    }

    // 토큰 생성
    public String createToken(String userId, long expireTIme) {
        long now = (new Date()).getTime();
        Date validity = new Date(now + expireTIme);

        return Jwts.builder()
                .setSubject(userId) // 토큰의 주인(userId) 저장
                .setIssuedAt(new Date())
                .setExpiration(validity) // 만료 시간 설정
                .signWith(key, SignatureAlgorithm.HS512) // 암호화 알고리즘
                .compact();
    }

    // 정보 추출
    public String getUserId(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    // 유효성 검증: 토큰이 변조되지 않았는지, 만료되지 않았는지 확인
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (io.jsonwebtoken.security.SecurityException | MalformedJwtException e) {
            log.info("잘못된 JWT 서명입니다.");
        } catch (ExpiredJwtException e) {
            log.info("만료된 JWT 토큰입니다.");
        } catch (UnsupportedJwtException e) {
            log.info("지원되지 않는 JWT 토큰입니다.");
        } catch (IllegalArgumentException e) {
            log.info("JWT 토큰이 잘못되었습니다.");
        }
        return false;
    }
}
