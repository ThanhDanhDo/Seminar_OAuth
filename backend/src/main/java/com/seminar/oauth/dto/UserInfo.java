package com.seminar.oauth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserInfo {
    private Long id;
    private String firebaseUid;
    private String email;
    private String displayName;
    private String photoUrl;
    private String provider;
}
