package com.seminar.oauth.service;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.seminar.oauth.dto.LoginRequest;
import com.seminar.oauth.dto.LoginResponse;
import com.seminar.oauth.dto.UserInfo;
import com.seminar.oauth.model.User;
import com.seminar.oauth.repository.UserRepository;
import com.seminar.oauth.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @Transactional
    public LoginResponse login(LoginRequest request) throws FirebaseAuthException {
        // Verify Firebase ID Token
        FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(request.getFirebaseIdToken());
        final String firebaseUid = decodedToken.getUid();
        final String email = decodedToken.getEmail();
        final String displayName = decodedToken.getName();
        final String photoUrl = decodedToken.getPicture();
        
        // Get provider from firebase claims (it's a Map object)
        final String provider;
        Object firebaseClaim = decodedToken.getClaims().get("firebase");
        if (firebaseClaim instanceof java.util.Map) {
            @SuppressWarnings("unchecked")
            java.util.Map<String, Object> firebaseMap = (java.util.Map<String, Object>) firebaseClaim;
            Object signInProvider = firebaseMap.get("sign_in_provider");
            provider = signInProvider != null ? signInProvider.toString() : "google.com";
        } else {
            provider = "google.com";
        }

        log.info("Firebase token verified for user: {}", email);

        // Find or create user
        User user = userRepository.findByFirebaseUid(firebaseUid)
                .orElseGet(() -> {
                    log.info("Creating new user: {}", email);
                    User newUser = User.builder()
                            .firebaseUid(firebaseUid)
                            .email(email)
                            .displayName(displayName)
                            .photoUrl(photoUrl)
                            .provider(provider != null ? provider : "google.com")
                            .build();
                    return userRepository.save(newUser);
                });

        // Update last login
        user.setLastLogin(LocalDateTime.now());
        if (displayName != null && !displayName.equals(user.getDisplayName())) {
            user.setDisplayName(displayName);
        }
        if (photoUrl != null && !photoUrl.equals(user.getPhotoUrl())) {
            user.setPhotoUrl(photoUrl);
        }
        userRepository.save(user);

        // Generate JWT access token
        String accessToken = jwtUtil.generateToken(firebaseUid, email);

        // Build response
        UserInfo userInfo = UserInfo.builder()
                .id(user.getId())
                .firebaseUid(user.getFirebaseUid())
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .photoUrl(user.getPhotoUrl())
                .provider(user.getProvider())
                .build();

        return LoginResponse.builder()
                .accessToken(accessToken)
                .tokenType("Bearer")
                .expiresIn(86400L) // 24 hours in seconds
                .user(userInfo)
                .build();
    }
}
