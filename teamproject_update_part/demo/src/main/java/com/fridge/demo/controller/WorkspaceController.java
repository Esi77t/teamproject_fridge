package com.fridge.demo.controller;

import com.fridge.demo.dto.WorkspaceDto;
import com.fridge.demo.service.WorkspaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/workspace")
@RequiredArgsConstructor
public class WorkspaceController {
    private final WorkspaceService workspaceService;

    @GetMapping
    public ResponseEntity<WorkspaceDto> getWorkspace(@AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(workspaceService.getWorkspace(userId));
    }
}
