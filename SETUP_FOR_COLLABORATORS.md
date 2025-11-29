# 🔧 Hướng Dẫn Setup Cho Collaborators

> **Dành cho người pull repository về và muốn chạy project**

## 📋 Tổng Quan

Repository này chứa React Native Expo app với **Google OAuth** và **Facebook Login**. Một số file config **KHÔNG được commit** vì chứa thông tin nhạy cảm. Bạn cần tạo lại các file này với credentials riêng của mình.

---

## ⚠️ Files Bị Gitignore (Cần Tạo Lại)

Các file sau **KHÔNG có trong repo** vì lý do bảo mật:

```
❌ google-services.json           (Firebase Android config)
❌ GoogleService-Info.plist       (Firebase iOS config)
❌ .env                           (Environment variables - nếu có)
❌ android/local.properties       (Android SDK path)
❌ *.keystore, *.jks              (Signing keys)
```

---

## 🚀 Quick Start (5 Bước)

### Bước 1: Clone & Install Dependencies

```bash
git clone <repository-url>
cd Seminar_OAuth
npm install
```

### Bước 2: Tạo Firebase Project

1. Truy cập [Firebase Console](https://console.firebase.google.com)
2. **Create a project** (hoặc dùng existing project)
3. Đặt tên project (ví dụ: `my-oauth-app`)

### Bước 3: Thêm Android App vào Firebase

1. Trong Firebase project, nhấn **Add app** → Chọn **Android**
2. Nhập **Android package name**: `com.anonymous.seminaroauth`
   > ⚠️ **QUAN TRỌNG**: Package name phải giống với `app.json`
3. Nhấn **Register app**
4. **Download `google-services.json`**
5. Copy file vào **thư mục gốc** của project:
   ```
   Seminar_OAuth/google-services.json
   ```

### Bước 4: Thêm iOS App vào Firebase (Optional - nếu build iOS)

1. Trong Firebase project, nhấn **Add app** → Chọn **iOS**
2. Nhập **iOS bundle ID**: `com.anonymous.seminaroauth`
3. Nhấn **Register app**
4. **Download `GoogleService-Info.plist`**
5. Copy file vào **thư mục gốc**:
   ```
   Seminar_OAuth/GoogleService-Info.plist
   ```

### Bước 5: Enable Authentication Providers

#### A. Enable Google Sign-In

1. Firebase Console → **Authentication** → **Sign-in method**
2. Nhấn **Google** → **Enable** → **Save**
3. Vào **Project Settings** → Tab **General**
4. Scroll xuống **"Your apps"** → Chọn Android app
5. Copy **Web client ID** (dạng: `xxx.apps.googleusercontent.com`)
6. Mở `hooks/useAuth.tsx` và **thay thế**:
   ```typescript
   GoogleSignin.configure({
     webClientId: 'PASTE_YOUR_WEB_CLIENT_ID_HERE',
   });
   ```

#### B. Enable Facebook Login

1. Tạo Facebook App tại [Facebook Developers](https://developers.facebook.com)
2. Lấy **App ID** và **Client Token**
3. Mở `app.json` và **thay thế**:
   ```json
   {
     "plugins": [
       [
         "react-native-fbsdk-next",
         {
           "appID": "YOUR_FACEBOOK_APP_ID",
           "clientToken": "YOUR_FACEBOOK_CLIENT_TOKEN",
           "displayName": "Your App Name",
           "scheme": "fbYOUR_FACEBOOK_APP_ID"
         }
       ]
     ]
   }
   ```
4. Firebase Console → **Authentication** → **Facebook**
5. Enable và nhập **App ID** + **App secret** từ Facebook

---

## 🔑 Thông Tin Cần Lấy Từ Owner

> **Gửi yêu cầu cho owner để nhận các thông tin sau:**

### 1. Firebase Project Info
- [ ] **Project ID**: `_____________`
- [ ] **Web Client ID**: `_____________`
- [ ] File `google-services.json` (hoặc tạo mới)
- [ ] File `GoogleService-Info.plist` (hoặc tạo mới)

### 2. Facebook App Info (nếu dùng Facebook Login)
- [ ] **Facebook App ID**: `_____________`
- [ ] **Facebook Client Token**: `_____________`
- [ ] **Facebook App Secret**: `_____________`

### 3. EAS Account (nếu build với EAS)
- [ ] **EAS Project ID**: `_____________`
- [ ] Hoặc chạy `eas init` để tạo project mới

---

## 🛠️ Setup Chi Tiết

### Option 1: Dùng Firebase Project Riêng (Recommended)

**Ưu điểm**: Bạn có full quyền quản lý, không phụ thuộc owner

**Bước thực hiện**:

1. **Tạo Firebase Project mới**
   - Vào [Firebase Console](https://console.firebase.google.com)
   - Create project với tên riêng của bạn

2. **Add Android App**
   - Package name: `com.anonymous.seminaroauth` (giữ nguyên)
   - Download `google-services.json`
   - Copy vào thư mục gốc

3. **Enable Google Sign-In**
   - Authentication → Sign-in method → Google → Enable
   - Lấy Web Client ID từ Project Settings

4. **Update code**
   ```typescript
   // hooks/useAuth.tsx
   GoogleSignin.configure({
     webClientId: 'YOUR_NEW_WEB_CLIENT_ID',
   });
   ```

5. **Add SHA Fingerprints**
   ```bash
   # Login EAS
   eas login
   
   # Lấy SHA-1 và SHA-256
   eas credentials
   ```
   Copy SHA-1 và SHA-256, thêm vào Firebase Console → Project Settings → SHA certificate fingerprints

6. **Build & Test**
   ```bash
   eas build --profile development --platform android
   ```

---

### Option 2: Xin Owner Share Firebase Project

**Ưu điểm**: Dùng chung project, không cần setup lại

**Bước thực hiện**:

1. **Yêu cầu owner thêm bạn vào Firebase Project**
   - Owner vào Firebase Console → Project Settings → Users and permissions
   - Add your email với role **Editor**

2. **Lấy config files**
   - Owner vào Project Settings → Your apps
   - Download `google-services.json` (Android)
   - Download `GoogleService-Info.plist` (iOS)
   - Gửi cho bạn qua email/Slack (KHÔNG commit vào Git!)

3. **Copy files vào project**
   ```
   Seminar_OAuth/
   ├── google-services.json
   └── GoogleService-Info.plist
   ```

4. **Không cần thay đổi code**
   - `hooks/useAuth.tsx` giữ nguyên Web Client ID
   - `app.json` giữ nguyên Facebook App ID

5. **Build & Test**
   ```bash
   npx expo start --dev-client
   ```

---

## 📱 Build Instructions

### Development Build (Cần Dev Server)

```bash
# Đăng nhập EAS
eas login

# Build development APK
eas build --profile development --platform android

# Sau khi cài APK, chạy dev server
npx expo start --dev-client
```

### Standalone Build (Không cần Dev Server)

```bash
# Build preview APK
eas build --profile preview --platform android

# Hoặc production APK
eas build --profile production --platform android
```

---

## 🧪 Kiểm Tra Setup

### Checklist

- [ ] `npm install` chạy thành công
- [ ] File `google-services.json` đã được tạo
- [ ] File `GoogleService-Info.plist` đã được tạo (nếu build iOS)
- [ ] `hooks/useAuth.tsx` có Web Client ID đúng
- [ ] `app.json` có Facebook App ID đúng (nếu dùng Facebook)
- [ ] Build development APK thành công
- [ ] App mở được trên thiết bị
- [ ] Google Sign-In hoạt động
- [ ] Facebook Login hoạt động (nếu enable)

### Test Google Sign-In

```bash
# Start dev client
npx expo start --dev-client

# Mở app trên thiết bị
# Nhấn "Sign in with Google"
# Kiểm tra: Đăng nhập thành công, chuyển vào Home screen
```

Nếu gặp lỗi **DEVELOPER_ERROR**:
1. Kiểm tra Web Client ID trong `useAuth.tsx`
2. Kiểm tra SHA-1/SHA-256 đã thêm vào Firebase
3. Đợi 5-10 phút để Firebase sync
4. Build lại APK

---

## 🔐 Security Best Practices

### ❌ KHÔNG Commit Những Files Sau:

```gitignore
# Firebase configs (chứa API keys)
google-services.json
GoogleService-Info.plist

# Environment variables
.env
.env.local

# Keystore files (signing keys)
*.keystore
*.jks

# Build artifacts
*.apk
*.aab
*.ipa

# Android local config
android/local.properties
```

### ✅ Cách Share Credentials An Toàn:

1. **Firebase**: Add collaborator qua Firebase Console (không gửi file)
2. **Keystore**: Dùng EAS Credentials (cloud-managed)
3. **Environment Variables**: Dùng 1Password, LastPass, hoặc gửi qua encrypted channel
4. **Secrets**: KHÔNG gửi qua Slack/Email plain text

---

## 🆘 Troubleshooting

### Lỗi: "Cannot find google-services.json"

**Giải pháp**:
1. Kiểm tra file `google-services.json` có trong thư mục gốc không
2. Chạy `npx expo prebuild --clean`
3. Build lại

### Lỗi: "DEVELOPER_ERROR" khi Google Sign-In

**Giải pháp**:
1. Chạy `eas credentials` để lấy SHA-1 và SHA-256
2. Thêm vào Firebase Console → Project Settings → SHA certificate fingerprints
3. Đợi 5-10 phút
4. Build lại APK

### Lỗi: "Invalid key hash" (Facebook)

**Giải pháp**:
1. Lấy SHA-1 từ `eas credentials`
2. Convert sang Facebook Key Hash:
   ```bash
   echo "SHA1_WITHOUT_COLONS" | xxd -r -p | openssl base64
   ```
3. Thêm vào Facebook Developers → Settings → Key Hashes

### Lỗi: "Native module not found"

**Nguyên nhân**: Đang dùng Expo Go (không support Firebase)

**Giải pháp**: Build Development Build hoặc Standalone APK

---

## 📞 Liên Hệ Owner

Nếu gặp vấn đề không thể tự giải quyết:

1. **Check Issues**: Xem [GitHub Issues](https://github.com/<your-repo>/issues)
2. **Slack/Discord**: Ping owner để xin support
3. **Email**: <owner-email>@example.com

**Thông tin cần cung cấp khi báo lỗi:**
- [ ] Error message (full log)
- [ ] Device: Android version, model
- [ ] Build profile: development/preview/production
- [ ] Steps to reproduce

---

## 📚 Tài Liệu Tham Khảo

- [Firebase Documentation](https://firebase.google.com/docs)
- [Expo Documentation](https://docs.expo.dev/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [React Native Firebase](https://rnfirebase.io/)
- [Google Sign-In Guide](https://react-native-google-signin.github.io/docs/)
- [Facebook Login Guide](https://developers.facebook.com/docs/facebook-login)

---

## 🎯 Template Checklist (Copy/Paste)

```markdown
## Setup Progress

- [ ] Cloned repo & npm install
- [ ] Created Firebase project: `____________`
- [ ] Downloaded google-services.json
- [ ] Downloaded GoogleService-Info.plist (iOS)
- [ ] Updated Web Client ID in useAuth.tsx
- [ ] Updated Facebook App ID in app.json (if needed)
- [ ] Added SHA-1 to Firebase
- [ ] Added SHA-256 to Firebase
- [ ] Built development APK: `eas build --profile development`
- [ ] Installed APK on device
- [ ] Tested Google Sign-In: ✅ / ❌
- [ ] Tested Facebook Login: ✅ / ❌
- [ ] App works without dev server: ✅ / ❌

## My Credentials

### Firebase
- Project ID: `____________`
- Web Client ID: `____________`

### Facebook (if used)
- App ID: `____________`
- Client Token: `____________`

### EAS
- Project ID: `____________`
- SHA-1: `____________`
- SHA-256: `____________`

## Issues Encountered
- [ ] None / Write here...
```

---

## ✅ Summary

**Để chạy được project này, bạn cần:**

1. ✅ Tạo Firebase Project riêng (hoặc xin owner share)
2. ✅ Download `google-services.json` và `GoogleService-Info.plist`
3. ✅ Update Web Client ID trong `hooks/useAuth.tsx`
4. ✅ Update Facebook credentials trong `app.json` (nếu dùng)
5. ✅ Add SHA fingerprints vào Firebase
6. ✅ Build APK với EAS: `eas build --profile development`
7. ✅ Test trên thiết bị thật

**Thời gian setup**: 20-30 phút (nếu chưa có Firebase project)

---

**Good luck! 🚀**
