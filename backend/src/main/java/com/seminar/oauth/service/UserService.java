package com.seminar.oauth.service;

import com.seminar.oauth.dto.UserInfo;
import com.seminar.oauth.model.User;
import com.seminar.oauth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;

    public UserInfo getUserInfo(String firebaseUid) {
        User user = userRepository.findByFirebaseUid(firebaseUid)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return UserInfo.builder()
                .id(user.getId())
                .firebaseUid(user.getFirebaseUid())
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .photoUrl(user.getPhotoUrl())
                .provider(user.getProvider())
                .build();
    }
}
