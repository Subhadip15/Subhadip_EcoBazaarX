package com.SignupForm.controller;

import com.SignupForm.service.InsightsService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/insights")
@RequiredArgsConstructor
public class InsightsController {

    private final InsightsService insightsService;

    // Requirement 4: User Dashboard
    @GetMapping("/user")
    public ResponseEntity<?> getUserInsights(Principal principal) {
        return ResponseEntity.ok(insightsService.getInsightsData(principal.getName()));
    }

    // Requirement 5: Admin Management
    @GetMapping("/admin/report")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAdminReport() {
        return ResponseEntity.ok(insightsService.getAdminGlobalReport());
    }
}