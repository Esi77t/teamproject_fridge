package com.fridge.demo.dto;

import com.fridge.demo.model.User;
import lombok.*;

public class UserDto {
    @Getter
    @Setter
    public static class SignUp {
        private String userId;
        private String password;
        private String nickname;
        private String email;
    }

    @Getter
    @Setter
    public static class Login {
        private String userId;
        private String password;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private Long id;
        private String userId;
        private String nickname;
        private String email;
        private String profileImageUrl;

        public static Response fromEntity(User user) {
            Response response = new Response();
            response.userId = user.getUserId();
            response.nickname = user.getNickname();
            response.email = user.getEmail();
            return response;
        }
    }
}
