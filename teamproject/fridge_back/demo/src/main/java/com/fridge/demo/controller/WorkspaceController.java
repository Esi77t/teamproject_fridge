package com.fridge.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fridge.demo.dto.WorkspaceDTO;
import com.fridge.demo.service.WorkspaceService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/workspace")
@Slf4j
public class WorkspaceController {
    
//    private final WorkspaceService workspaceService;
//
//    /**
//     * 로그인한 사용자의 전체 작업 공간(냉장고, 장바구니) 데이터를 조회하는 API
//     */
//    @GetMapping
//    public ResponseEntity<WorkspaceDTO> getWorkspace(Authentication authentication) {
//        String userId = authentication.getName();
//        log.info("WorkspaceController 사용자 ID : " + userId);
//
//        // 200 OK 상태 코드와 함께 사용자의 전체 데이터를 응답 바디에 담아 보냅니다.
//        WorkspaceDTO workspaceData = workspaceService.getWorkspaceForUser(userId);
//        return ResponseEntity.ok(workspaceData);
//    }
}