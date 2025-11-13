package com.seminar.oauth.service;

import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.FirestoreOptions;
import com.google.firebase.cloud.FirestoreClient;
import com.seminar.oauth.dto.UserInfo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

/**
 * Alternative implementation using Firebase Firestore instead of PostgreSQL
 * To use this:
 * 1. Comment out PostgreSQL dependencies in pom.xml
 * 2. Replace UserRepository with FirestoreUserService in AuthService and UserService
 * 3. Remove JPA/Hibernate configurations
 */
@Service
@Slf4j
public class FirestoreUserService {

    private static final String COLLECTION_NAME = "users";

    private Firestore getFirestore() {
        return FirestoreClient.getFirestore();
    }

    public UserInfo findOrCreateUser(String firebaseUid, String email, String displayName, 
                                     String photoUrl, String provider) {
        try {
            Firestore db = getFirestore();
            DocumentReference docRef = db.collection(COLLECTION_NAME).document(firebaseUid);
            DocumentSnapshot document = docRef.get().get();

            if (document.exists()) {
                // Update existing user
                log.info("User found in Firestore: {}", email);
                Map<String, Object> updates = new HashMap<>();
                updates.put("lastLogin", new Date());
                updates.put("updatedAt", new Date());
                
                if (displayName != null) {
                    updates.put("displayName", displayName);
                }
                if (photoUrl != null) {
                    updates.put("photoUrl", photoUrl);
                }
                
                docRef.update(updates).get();

                return mapToUserInfo(document);
            } else {
                // Create new user
                log.info("Creating new user in Firestore: {}", email);
                Map<String, Object> userData = new HashMap<>();
                userData.put("firebaseUid", firebaseUid);
                userData.put("email", email);
                userData.put("displayName", displayName);
                userData.put("photoUrl", photoUrl);
                userData.put("provider", provider != null ? provider : "google.com");
                userData.put("createdAt", new Date());
                userData.put("updatedAt", new Date());
                userData.put("lastLogin", new Date());

                docRef.set(userData).get();

                return UserInfo.builder()
                        .firebaseUid(firebaseUid)
                        .email(email)
                        .displayName(displayName)
                        .photoUrl(photoUrl)
                        .provider(provider != null ? provider : "google.com")
                        .build();
            }
        } catch (InterruptedException | ExecutionException e) {
            log.error("Firestore operation failed", e);
            throw new RuntimeException("Failed to access Firestore", e);
        }
    }

    public UserInfo getUserInfo(String firebaseUid) {
        try {
            Firestore db = getFirestore();
            DocumentReference docRef = db.collection(COLLECTION_NAME).document(firebaseUid);
            DocumentSnapshot document = docRef.get().get();

            if (document.exists()) {
                return mapToUserInfo(document);
            } else {
                throw new RuntimeException("User not found");
            }
        } catch (InterruptedException | ExecutionException e) {
            log.error("Firestore operation failed", e);
            throw new RuntimeException("Failed to access Firestore", e);
        }
    }

    private UserInfo mapToUserInfo(DocumentSnapshot document) {
        return UserInfo.builder()
                .firebaseUid(document.getString("firebaseUid"))
                .email(document.getString("email"))
                .displayName(document.getString("displayName"))
                .photoUrl(document.getString("photoUrl"))
                .provider(document.getString("provider"))
                .build();
    }
}
