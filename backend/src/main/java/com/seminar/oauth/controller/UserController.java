package com.seminar.oauth.controller;

import com.seminar.oauth.dto.UserInfo;
import com.seminar.oauth.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    @GetMapping("/info")
    public ResponseEntity<UserInfo> getUserInfo(Authentication authentication) {
        try {
            String firebaseUid = authentication.getName();
            log.info("Getting user info for: {}", firebaseUid);
            UserInfo userInfo = userService.getUserInfo(firebaseUid);
            return ResponseEntity.ok(userInfo);
        } catch (Exception e) {
            log.error("Failed to get user info", e);
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<UserInfo> getProfile(Authentication authentication) {
        // Same as getUserInfo, just another endpoint example
        return getUserInfo(authentication);
    }
}
